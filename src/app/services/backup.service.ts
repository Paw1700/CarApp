import { Injectable } from '@angular/core';
import { AppData } from './data/_main.service';
import { DatabaseManager } from '../util/db.driver';
import { AppDataMajorVersions, AppVersion, AppVersionIteration } from '../models/app_version.model';
import { AppEnvironment } from '../environment';
import { Backup } from '../models/backup.model';
import { CarDBModel } from '../models/car.model';
import { Backup_V2_0_5, Backup_V_2_1_3, CarBrand_V_2_0_5, CarDBModel_V_2_0_5, Engine_V_2_0_5, Gearbox_V_2_0_5, Insurance_V_2_0_5, Route_V_2_0_5 } from '../models/old_models.model';
import { CarBrand } from '../models/car_brand.model';
import { CombustionEngine, ElectricEngine } from '../models/engine.model';
import { Gearbox } from '../models/gearbox.model';
import { Insurance } from '../models/insurance.model';
import { AppValidator } from './validator.service';
import { Route } from '../models/route.model';

@Injectable()
export class AppBackup {
    constructor(private DATA: AppData, private DB: DatabaseManager, private VALIDATOR: AppValidator) { }

    get version(): AppVersion {
        return AppEnvironment.APP_VERSION;
    }

    createBackup(oldVersion?: AppDataMajorVersions): Promise<Backup | Backup_V2_0_5> {
        return new Promise(async (resolve, reject) => {
            if (oldVersion === undefined) {
                try {
                    const backup = new Backup()
                    backup.appVersion = this.convertAppVersion(AppEnvironment.APP_VERSION, undefined) as string
                    backup.carBrands = await this.DATA.CAR_BRAND.getAll()
                    backup.cars = await this.DATA.CAR.getAll(true) as CarDBModel[]
                    backup.choosedCarID = this.DATA.getChoosedCarID()
                    backup.creationDate = new Date().toJSON()
                    backup.fuelCalcConfig = this.DATA.getFuelConfig()
                    backup.igd = await this.DB.EXPORT_IGD()
                    backup.routes = await this.DATA.ROUTE.getAll()
                    resolve(backup)
                } catch (err) {
                    reject(err)
                }
            } else {
                switch (oldVersion) {
                    case '2.0.5':
                        try {
                            this.DB.closeDB()
                            const db_name = 'CarApp'
                            const db_version = 1
                            const db_stores = ['carBrands', 'cars', 'engines', 'gearboxes', 'insurances', 'routes']
                            await this.DB.initDB(db_name, db_version, db_stores)
                            const car_brands = await this.DB.getAllObject<CarBrand_V_2_0_5>(db_stores[0])
                            const cars = await this.DB.getAllObject<CarDBModel_V_2_0_5>(db_stores[1])
                            const engines = await this.DB.getAllObject<Engine_V_2_0_5>(db_stores[2])
                            const gearboxes = await this.DB.getAllObject<Gearbox_V_2_0_5>(db_stores[3])
                            const insurances = await this.DB.getAllObject<Insurance_V_2_0_5>(db_stores[4])
                            const routes = await this.DB.getAllObject<Route_V_2_0_5>(db_stores[5])
                            const IGD = await this.DB.EXPORT_IGD()
                            const fuel_config = this.DB.LS_getData('fuelConfigAvgUsage')
                            const choosed_car_ID = this.DB.LS_getData('choosedCarID')
                            const return_backup = new Backup_V2_0_5('14', new Date().toJSON(), db_stores, choosed_car_ID, Number(fuel_config), IGD, { indexInIGD: 0, data: car_brands }, { indexInIGD: 0, data: cars }, { indexInIGD: 0, data: insurances }, { indexInIGD: 0, data: gearboxes }, { indexInIGD: 0, data: engines }, { indexInIGD: 0, data: routes })
                            this.DB.closeDB()
                            resolve(return_backup)
                        } catch (err) {
                            console.error(err);
                        }
                        break
                }
            }
        });
    }

    implementBackup(backup: Backup): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const backup_validation = await this.VALIDATOR.validateBackup(backup)
            if (!backup_validation.pass) {
                console.error(backup_validation.reason);
                reject(backup_validation.errCode)
                return
            }
            await this.DATA.reset()
            await this.DATA.start()
            this.DATA.saveChoosedCarID(backup.choosedCarID)
            this.DATA.saveFuelConfig(backup.fuelCalcConfig)
            await this.DB.IMPORT_IGD(backup.igd)
            for (let i = 0; i <= backup.carBrands.length - 1; i++) {
                await this.DATA.CAR_BRAND.saveOne(backup.carBrands[i], true)
            }
            for (let i = 0; i <= backup.cars.length - 1; i++) {
                await this.DATA.CAR.saveOne(backup.cars[i], true, true)
            }
            for (let i = 0; i <= backup.routes.length - 1; i++) {
                await this.DATA.ROUTE.saveOne(backup.routes[i], true)
            }
            this.DB.closeDB()
            resolve()
        })
    }

    convertAppVersion(objTypeVersion: AppVersionIteration | AppVersion | undefined, stringTypeVersion: string | undefined): AppVersionIteration | string | undefined {
        if (objTypeVersion && !stringTypeVersion) {
            let appVersionString = objTypeVersion.edition + "." + objTypeVersion.version + "." + objTypeVersion.patch + "." + objTypeVersion.compilation + "." + objTypeVersion.compilationIteration
            if (objTypeVersion.beta) {
                appVersionString = appVersionString + ".B." + objTypeVersion.build
            }
            return appVersionString
        } else if (!objTypeVersion && stringTypeVersion) {
            let appVersionObject = new AppVersionIteration()
            let stage = 0
            let stageBucket = ''
            for (let l = 0; l <= stringTypeVersion.length; l++) {
                let loop_char = stringTypeVersion.charAt(l)
                if (l === stringTypeVersion.length) {
                    endOfStage(stage, stageBucket)
                } else if (loop_char === '.') {
                    endOfStage(stage, stageBucket)
                    stage += 1
                    stageBucket = ''
                } else {
                    stageBucket += loop_char
                }
            }

            return appVersionObject

            function endOfStage(stage: number, data: string) {
                switch (stage) {
                    case 0:
                        appVersionObject.edition = Number(data)
                        break
                    case 1:
                        appVersionObject.version = Number(data)
                        break
                    case 2:
                        appVersionObject.patch = Number(data)
                        break
                    case 3:
                        appVersionObject.compilation = Number(data)
                        break
                    case 4:
                        appVersionObject.compilationIteration = data
                        break
                    case 5:
                        appVersionObject.beta = true
                        break
                    case 6:
                        appVersionObject.build = data
                        break
                }
            }
        } else {
            console.error(`You did not give proper function arguements. It's can use only one argument one of them need to be undefined!`);
            return undefined
        }
    }

    readBackup(backup_string: string): Backup | undefined {
        const backup_data_major_version = this.checkIfAppBackupDataMajorVersion(backup_string)
        switch (backup_data_major_version) {
            case "2.0.5":
            case '2.1.3':
                return this.convertOldBackupToActual(backup_string, backup_data_major_version)
            case "actual":
                return JSON.parse(backup_string) as Backup
            default:
                return undefined
        }
    }

    convertOldBackupToActual(old_verrsion: string, backup_version: AppDataMajorVersions): Backup {
        const return_backup = new Backup()
        switch (backup_version) {
            case '2.0.5': // REMOVE GEARBOX, ENGINE, INSURANCE | CONVERT BRAND MODEL | CONVERT CARDBMODEL (ADDING GEARBOX, INSURANCE, ENGINES) | CONVERT ROUTE TO ROUTE WITH ELECTRIC DATA 
                const backup_2_0_5 = JSON.parse(old_verrsion) as Backup_V2_0_5
                const newIGD = backup_2_0_5.IGD.filter(
                    el => {
                        if (el.storeName === 'engines' || el.storeName === 'gearboxes' || el.storeName === 'insurances') {
                            return false
                        }
                        return true
                    }
                )
                const car_brands_2_0_5: CarBrand[] = []
                backup_2_0_5.CarBrands.data.forEach(brand => {
                    let brandForDarkMode: string | null = null
                    if (brand.brandImage.light !== brand.brandImage.dark) {
                        brandForDarkMode = brand.brandImage.dark
                    }
                    car_brands_2_0_5.push(new CarBrand(brand.id, brand.name, { default: brand.brandImage.light, for_dark_mode: brandForDarkMode }))
                })
                const cars_2_0_5: CarDBModel[] = []
                backup_2_0_5.Cars.data.forEach(car => {
                    const oldCombustionEng = backup_2_0_5.Engines.data.filter(eng => eng.id === car.engineID).at(0)
                    if (oldCombustionEng === undefined) {
                        console.error('oldCombustion Error')
                        return;
                    }
                    const combustionEng = new CombustionEngine(Number(oldCombustionEng.volume), oldCombustionEng.pistonDesign, Number(oldCombustionEng.pistonAmount), oldCombustionEng.fuelType, Number(car.fuelTankVolume), Number(car.avgManufactureFuelUsage), Number(oldCombustionEng.power), Number(oldCombustionEng.torque))
                    const oldGearbox = backup_2_0_5.Gearboxes.data.filter(gearbox => gearbox.id === car.gearboxID).at(0)
                    if (oldGearbox === undefined) {
                        console.error('oldGearbox Error')
                        return;
                    }
                    const gearbox = new Gearbox(oldGearbox.type, Number(oldGearbox.gearsAmount))
                    const oldInsurance = backup_2_0_5.Insurances.data.filter(ins => ins.id === car.insuranceID).at(0)
                    if (oldInsurance === undefined) {
                        console.error('oldInsurance Error')
                        return;
                    }
                    const insurance = new Insurance(oldInsurance.name, oldInsurance.startDate, oldInsurance.endsDate, oldInsurance.options)
                    cars_2_0_5.push(new CarDBModel(car.id, car.brandID, car.model, { actual: Number(car.mileage), at_review: Number(car.mileageAtReview) }, 'Combustion', { combustion: combustionEng, electric: new ElectricEngine() }, gearbox, car.driveType, insurance, car.techReviewEnds, { theme: car.themeColor, accent: car.accentColor }, { side: car.photo.side, front_left: car.photo.frontLeft }))
                })
                const routes_2_0_5: Route[] = []
                backup_2_0_5.Routes.data.forEach(
                    route => {
                        routes_2_0_5.push(new Route(route.id, route.carID, route.date, Number(route.originalAvgFuelUsage), Number(route.distance), { combustion: {include: true, amount: Number(route.avgFuelUsage)}, electric: {include: false, amount: 0} }))
                    }
                )
                return_backup.appVersion = '2.0.5'
                return_backup.carBrands = car_brands_2_0_5
                return_backup.cars = cars_2_0_5
                return_backup.choosedCarID = backup_2_0_5.choosedCarID
                return_backup.creationDate = backup_2_0_5.BACKUP_CREATED_TIME
                return_backup.fuelCalcConfig = backup_2_0_5.FuelCalcConfing
                return_backup.igd = newIGD
                return_backup.routes = routes_2_0_5
                break
            case '2.1.3': // CONVERT DATAs MODEL PROPERTY NAMING | MULTIPLY HYBRID ROUTES COMBUSTION USAGE WITH 6      
                const backup_2_1_3 = JSON.parse(old_verrsion) as Backup_V_2_1_3
                const car_brands_2_1_3: CarBrand[] = []
                backup_2_1_3.carBrands.forEach( brand => {
                    car_brands_2_1_3.push(new CarBrand(brand.id, brand.name, {default: brand.brandImageSet.default, for_dark_mode: brand.brandImageSet.forDarkMode}))
                })
                const cars_2_1_3: CarDBModel[] = []
                backup_2_1_3.cars.forEach( car => {
                    const combustion_eng_2_1_3 = car.engine.combustion
                    const electric_eng_2_1_3 = car.engine.electric
                    cars_2_1_3.push(new CarDBModel(car.id, car.brandId, car.model, {actual: car.mileage.actual, at_review: car.mileage.atReview}, car.type, {combustion: new CombustionEngine(combustion_eng_2_1_3.volume, combustion_eng_2_1_3.pistonDesign, combustion_eng_2_1_3.pistonAmount, combustion_eng_2_1_3.fuelType, combustion_eng_2_1_3.fuelTankVolume, combustion_eng_2_1_3.avgFuelUsage, combustion_eng_2_1_3.power, combustion_eng_2_1_3.torque), electric: new ElectricEngine(electric_eng_2_1_3.energyStorage, electric_eng_2_1_3.energyStorageVolume, electric_eng_2_1_3.energyAvgUsage, electric_eng_2_1_3.power, electric_eng_2_1_3.torque)}, new Gearbox(car.gearbox.type, car.gearbox.gearsAmount), car.driveType, new Insurance(car.insurance.name, car.insurance.startDate, car.insurance.endsDate, car.insurance.options), car.techReviewEnds, car.color, {side: car.photo.side, front_left: car.photo.frontLeft}))
                })
                const routes_2_1_3: Route[] = []
                backup_2_1_3.routes.forEach( route => {
                    if (route.usage.combustion.amount !== 0 && route.usage.electric.amount !== 0) {
                        route.usage.combustion.amount = route.usage.combustion.amount * 6
                    }
                    routes_2_1_3.push(new Route(route.id, route.carID, route.date, route.originalAvgFuelUsage, route.distance, route.usage))
                })
                return_backup.appVersion = backup_2_1_3.appVersion
                return_backup.carBrands = car_brands_2_1_3
                return_backup.cars = cars_2_1_3
                return_backup.choosedCarID = backup_2_1_3.choosedCarID
                return_backup.creationDate = backup_2_1_3.creationDate
                return_backup.fuelCalcConfig = backup_2_1_3.fuelCalcConfig
                return_backup.igd = backup_2_1_3.igd
                return_backup.routes = routes_2_1_3
                break
        }
        return return_backup
    }

    private checkIfAppBackupDataMajorVersion(backup_string: string): AppDataMajorVersions | undefined {
        const backup_obj = JSON.parse(backup_string)
        if (backup_obj.APP_VERSION_ID) {
            return '2.0.5'
        } else if (backup_obj.appVersion) {
            const app_version = this.convertAppVersion(undefined, backup_obj.appVersion) as AppVersionIteration
            if (app_version.edition <= 2 && app_version.version < 2) {
                return '2.1.3'
            } 
            return "actual"
        } else {
            return undefined
        }
    }
}
