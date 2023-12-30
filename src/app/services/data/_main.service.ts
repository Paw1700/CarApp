import { Injectable } from "@angular/core";
import { DatabaseManager } from "../../util/db.driver";
import ERRORS_JSON from "../../data/errors.json"
import { ErrorID } from "../../data/types";
import { ErrorModel } from "../../models/error.model";

export class DB_STORES {
    constructor(
        public carBrands: string = 'carBrands',
        public cars: string = 'cars',
        public routes: string = 'routes'
    ) { }
}

export class LS_STORES {
    constructor(
        public choosedCarID = 'choosedCarID',
        public usedAppVersion = 'usedAppVersion',
        public fuelConfigAvgUsage = 'fuelConfigAvgUsage'
    ) { }
}

@Injectable()
export class AppData {
    constructor (private DB: DatabaseManager) { }

    private readonly DB_NAME = 'CarApp'
    private readonly DB_VERSION = 1
    private readonly DB_STORES = new DB_STORES()
    private readonly LS_STORES = new LS_STORES()
    private readonly ERRORS: ErrorModel[] = ERRORS_JSON

    start(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.DB.initLS(Object.getOwnPropertyNames(this.LS_STORES))
            try {
                this.DB.initDB(this.DB_NAME, this.DB_VERSION, Object.getOwnPropertyNames(this.DB_STORES))
                resolve()
            } catch {
                reject('DB-CONNECT-ERROR')
            }
        })
    }

    reset(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                this.DB.clearLS()
                await this.DB.deleteDB(this.DB_NAME)
                resolve()
            } catch {
                reject("APP-RESET-ERROR")
            }
        })
    }

    saveAppVersion(version: string | null): void {
        if (version === null) {
            version = ''
        }
        this.DB.LS_insertData(this.LS_STORES.usedAppVersion, version)
    }

    getAppVersion(): string | null {
        return this.DB.LS_getData(this.LS_STORES.usedAppVersion)
    }

    getChoosedCarID(): string | null {
        const id = this.DB.LS_getData(this.LS_STORES.choosedCarID)
        if (id !== '' || id !== null) {
            return id
        } else {
            return null
        }
    }

    saveChoosedCarID(carID: string | null): void {
        if (carID === null) {
            carID = ''
        }
        this.DB.LS_insertData(this.LS_STORES.choosedCarID, carID)
    }

    getError(errID: ErrorID): ErrorModel | undefined {
        return this.ERRORS.find(err => err.id === errID)
    }

    //? getIGD and setIGD maybe not be necesary
}