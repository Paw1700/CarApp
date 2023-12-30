import { Injectable } from "@angular/core"

type GenericObjectID = number | string

interface GenericObject {
    id: GenericObjectID
}

export class IndexGeneratorData {
    constructor(
        public id: string,
        public storeName: string,
        public indexesPoll: number[]
    ) { }
}

@Injectable()
export class DatabaseManager {
    private readonly IndexedDB = window.indexedDB

    private db!: IDBDatabase
    private IGDStoreName = 'IndexGeneratorData'

    public dbConnectionExist = false

    public initLS(lsStores: string[]) {
        lsStores.forEach(
            store => {
                if (localStorage.getItem(store) === null) {
                    localStorage.setItem(store, '')
                }
            }
        )
    }

    public clearLS() {
        localStorage.clear()
    }

    public LS_getData(store: string) {
        return localStorage.getItem(store)
    }

    public LS_insertData(store: string, value: string) {
        localStorage.setItem(store, value)
    }

    public LS_removeData(store: string) {
        localStorage.removeItem(store)
    }

    public initDB(dbName: string, dbVersion: number, dbStores: string[], clearIndex: boolean = false): Promise<void> {
        return new Promise(
            (resolve, reject) => {
                if(this.dbConnectionExist) {
                    reject('DB arleady exist!')
                    return 
                }
                const openRequest = this.IndexedDB.open(dbName, dbVersion)
                openRequest.onerror = () => {
                    console.error('Error during creating DB!')
                    reject()
                }
                openRequest.onupgradeneeded = () => {
                    this.db = openRequest.result
                    this.db.createObjectStore(this.IGDStoreName)
                    dbStores.forEach(
                        store => {
                            if (!this.db.objectStoreNames.contains(store)) {
                                this.db.createObjectStore(store)
                            }
                        }
                    )
                    console.log('DB updated!')
                }
                openRequest.onsuccess = async () => {
                    this.db = openRequest.result
                    this.dbConnectionExist = true
                    try {
                        if (clearIndex) {
                            await this.CLEAR_INDEX_DATA()
                            await this.CHECK_INDEX_DATA_INTEGRITY()
                        }
                        console.log('DB initiated!')
                        resolve()
                    } catch {
                        reject()
                    }
                }
            }
        )
    }

    public closeDB(): void {
        this.db.close()
        this.dbConnectionExist = false
    }

    public deleteDB(dbName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const deleteDBRequest = this.IndexedDB.deleteDatabase(dbName)

            deleteDBRequest.onblocked = () => {
                this.closeDB()
            }

            deleteDBRequest.onerror = () => {
                this.handleError(dbName, 'delete')
                reject()
            }

            deleteDBRequest.onsuccess = (e) => {
                if (deleteDBRequest.result === undefined) {
                    resolve()
                } else {
                    reject()
                }
            }
        })
    }

    public insertObject<T extends GenericObject>(dbStore: string, insertedObject: T): Promise<void> {
        return new Promise(
            (resolve, reject) => {
                const insertRequest = this.openTransactionWithStore(dbStore, 'readwrite').put(insertedObject, insertedObject.id)

                insertRequest.onerror = () => {
                    this.handleError(dbStore, 'insert')
                    reject()
                }

                insertRequest.onsuccess = () => {
                    resolve()
                }
            }
        )
    }

    public getObject<T extends GenericObject>(dbStore: string, objectID: GenericObjectID): Promise<T> {
        return new Promise(
            (resolve, reject) => {
                const getRequest = this.openTransactionWithStore(dbStore, 'readonly').get(objectID)

                getRequest.onerror = () => {
                    this.handleError(dbStore, 'get')
                    reject()
                }

                getRequest.onsuccess = () => {
                    resolve(getRequest.result)
                }
            }
        )
    }

    public getAllObject<T extends GenericObject>(dbStore: string): Promise<T[]> {
        return new Promise(
            (resolve, reject) => {
                const getRequest = this.openTransactionWithStore(dbStore, 'readonly').getAll()

                getRequest.onerror = () => {
                    this.handleError(dbStore, 'get all')
                    reject()
                }

                getRequest.onsuccess = () => {
                    resolve(getRequest.result)
                }
            }
        )
    }

    public deleteObject(dbStore: string, objectID: GenericObjectID): Promise<void> {
        return new Promise(
            (resolve, reject) => {
                const deleteRequest = this.openTransactionWithStore(dbStore, 'readwrite').delete(objectID)

                deleteRequest.onerror = () => {
                    this.handleError(dbStore, 'delete')
                    reject()
                }

                deleteRequest.onsuccess = () => {
                    if (deleteRequest.result !== undefined) {
                        this.handleError(dbStore, 'delete')
                        reject()
                    }

                    resolve()
                }
            }
        )
    }

    public deleteAllObjects(dbStore: string): Promise<void> {
        return new Promise(
            (resolve, reject) => {
                const deleteRequest = this.openTransactionWithStore(dbStore, 'readwrite').clear()

                deleteRequest.onerror = () => {
                    this.handleError(dbStore, 'delete')
                    reject()
                }

                deleteRequest.onsuccess = () => {
                    if (deleteRequest.result !== undefined) {
                        this.handleError(dbStore, 'delete')
                        reject()
                    }

                    resolve()
                }
            }
        )
    }

    public editObject<T extends GenericObject>(dbStore: string, newObject: T): Promise<void> {
        return new Promise(
            (resolve, reject) => {
                const updateRequest = this.openTransactionWithStore(dbStore, 'readwrite').put(newObject, newObject.id)

                updateRequest.onerror = () => {
                    this.handleError(dbStore, 'update')
                    reject()
                }

                updateRequest.onsuccess = () => {
                    if (updateRequest.result === undefined) {
                        this.handleError(dbStore, 'update')
                        reject()
                    }
                    resolve()
                }
            }
        )
    }

    public countObjects(dbStore: string): Promise<number> {
        return new Promise(
            (resolve, reject) => {
                const countRequest = this.openTransactionWithStore(dbStore, 'readonly').count()

                countRequest.onerror = () => {
                    this.handleError(dbStore, 'count')
                    reject()
                }

                countRequest.onsuccess = () => {
                    resolve(countRequest.result)
                }
            }
        )
    }

    private openTransactionWithStore(store: string, mode: IDBTransactionMode): IDBObjectStore {
        const transaction = this.db.transaction(store, mode)
        return transaction.objectStore(store)
    }

    private handleError(storeName: string, operation: string): void {
        console.error(`Error occured during operation: ${operation} for store ${storeName}`)
    }

    public EXPORT_IGD(): Promise<IndexGeneratorData[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const igd = await this.getAllObject<IndexGeneratorData>(this.IGDStoreName)
                resolve(igd)
            } catch {
                reject()
            }
        })
    }

    public IMPORT_IGD(igd: IndexGeneratorData[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            igd.forEach(
                async igdData => {
                    await this.insertObject<IndexGeneratorData>(this.IGDStoreName, igdData)
                }
            )
            resolve()
        })
    }

    public RESET_INDEX_DATA(): Promise<void> {
        return new Promise((resolve, reject) => {
            const resetRequest = this.openTransactionWithStore(this.IGDStoreName, 'readwrite').clear()

            resetRequest.onerror = () => {
                this.handleError(this.IGDStoreName, 'reset')
                reject()
            }

            resetRequest.onsuccess = () => {
                if (resetRequest.result !== undefined) {
                    this.handleError(this.IGDStoreName, 'reset')
                    reject()
                }

                resolve()
            }
        })
    }

    public GENERATE_INDEX(store: string): Promise<string> {
        return new Promise(
            async (resolve, reject) => {
                const IGD = await this.getAllObject<IndexGeneratorData>(this.IGDStoreName)
                const storeIndexInIGD = IGD.findIndex(
                    igd => {
                        if (igd.storeName === store) {
                            return true
                        }
                        return false
                    }
                )
                if (storeIndexInIGD !== -1) {
                    let indexNumber = -1
                    let freePoll = false
                    if (IGD[storeIndexInIGD].indexesPoll.length !== 0) {
                        while (!freePoll) {
                            indexNumber = indexNumber + 1
                            freePoll = !IGD[storeIndexInIGD].indexesPoll.includes(indexNumber)
                        }
                    } else {
                        indexNumber = 0
                    }
                    const index = store + "-" + indexNumber
                    IGD[storeIndexInIGD].indexesPoll.push(indexNumber)
                    await this.insertObject<IndexGeneratorData>(this.IGDStoreName, IGD[storeIndexInIGD])
                    resolve(index)
                } else {
                    const index = store + '-0'
                    await this.insertObject<IndexGeneratorData>(this.IGDStoreName, new IndexGeneratorData(store, store, [0]))
                    resolve(index)
                }
            }
        )
    }

    public RELEASE_INDEX(store: string, objectID: string): Promise<void> {
        return new Promise(
            async (resolve) => {
                const IGD = await this.getAllObject<IndexGeneratorData>(this.IGDStoreName)
                const storeStringLength = store.length + 1
                const indexToDelete = +objectID.substring(storeStringLength)
                const storeIndexInIGD = IGD.findIndex(
                    igd => {
                        if (igd.storeName === store) {
                            return true
                        }
                        return false
                    }
                )
                const indexOfIndexInIGDStore = IGD[storeIndexInIGD].indexesPoll.findIndex(
                    indx => {
                        if (indx === indexToDelete) {
                            return true
                        }
                        return false
                    }
                )
                IGD[storeIndexInIGD].indexesPoll.splice(indexOfIndexInIGDStore, 1)
                await this.insertObject<IndexGeneratorData>(this.IGDStoreName, IGD[storeIndexInIGD])
                resolve()
            }
        )
    }

    private CHECK_INDEX_DATA_INTEGRITY(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const IGD = await this.getAllObject<IndexGeneratorData>(this.IGDStoreName)
            for (let i = 0; i < IGD.length; i++) {
                const loop_store = IGD[i].storeName
                const loop_indexes_poll = IGD[i].indexesPoll
                const store_data = await this.getAllObject(loop_store)
                for (let i = 0; i < store_data.length; i++) {
                    const loop_data_id_number = Number(store_data[i].id.toString().substring(loop_store.length+1))
                    let store_data_integrated = false
                    for (let j = 0; j < loop_indexes_poll.length; j++) {
                        if (loop_data_id_number === loop_indexes_poll[j]) {
                            store_data_integrated = true
                        }
                    }
                    if (!store_data_integrated) {
                        reject()
                        return
                    }
                }
            }
            resolve()
        })
    }

    private CLEAR_INDEX_DATA(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const IGD = await this.getAllObject<IndexGeneratorData>(this.IGDStoreName)
            for (let i = 0; i < IGD.length; i++) {
                const loop_store = IGD[i].storeName
                const loop_indexes_poll = IGD[i].indexesPoll
                for (let i = 0; i < loop_indexes_poll.length; i++) {
                    const loop_index = loop_indexes_poll[i]
                    const data_id = loop_store+'-'+loop_index
                    const loop_data = await this.getObject(loop_store, data_id)
                    if (!loop_data) { // IF DATA NOT FOUND IT'S ID IS UNDEFINED
                        await this.RELEASE_INDEX(loop_store, data_id)
                    }
                }
            }
            resolve()
        })
    }
}