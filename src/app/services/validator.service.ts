import { DB_STORES } from './data/_main.service';
import { Injectable } from "@angular/core";
import { DatabaseManager } from "../util/db.driver";
import { ErrorID } from '../models/error.model';
import { CarBrand } from '../models/car_brand.model';
import { CarDBModel } from '../models/car.model';
import { CombustionEngine, ElectricEngine } from '../models/engine.model';
import { Gearbox } from '../models/gearbox.model';
import { Insurance } from '../models/insurance.model';
import { Route } from '../models/route.model';
import { Backup } from '../models/backup.model';

@Injectable()
export class AppValidator {
    constructor(private DB: DatabaseManager) { }

    private readonly DB_STORES = new DB_STORES()

    validateBackup(backup: Backup): Promise<ValidationResult> {
        return new Promise(async (resolve) => {
            if (!this.hasValue(backup.appVersion, 'string')) {
                resolve({ pass: false, reason: "Brak wersji aplikacji w kopii zapasowej!", errCode: "BACKUP-VALIDATION-ERROR" })
                return
            }
            if (!this.hasValue(backup.creationDate, 'string')) {
                resolve({ pass: false, reason: "Brak daty utworzenia backupu!", errCode: "BACKUP-VALIDATION-ERROR" })
                return
            }
            if (backup.choosedCarID === undefined) {
                resolve({ pass: false, reason: "Brak danych wybranego auta!", errCode: "BACKUP-VALIDATION-ERROR" })
                return
            }
            if (backup.fuelCalcConfig === undefined) {
                resolve({ pass: false, reason: "Brak konfiguracji spalania!", errCode: "BACKUP-VALIDATION-ERROR" })
                return
            }
            if (backup.igd === undefined) {
                resolve({ pass: false, reason: "Brak IndexGeneratorData!", errCode: "BACKUP-VALIDATION-ERROR" })
                return
            }
            if (backup.carBrands === undefined) {
                resolve({pass: false, reason: 'Brak marek w kopii zapasowej', errCode: "BACKUP-VALIDATION-ERROR"})
                return
            }
            if (backup.cars !== undefined) {
                for (let i = 0; i <= backup.cars.length - 1; i++) {
                    const car_validation = await this.validateCar(backup.cars[i], true, backup.carBrands)
                    if (!car_validation.pass) {
                        resolve({pass: false, reason: "Błąd walidacji aut w kopii zaposowej [CarBrand]", errCode: "BACKUP-VALIDATION-ERROR"})
                        return 
                    }
                }
            } else {
                resolve({ pass: false, reason: "Brak marek w kopii zapasowej!", errCode: "BACKUP-VALIDATION-ERROR" })
            }
            if (backup.routes !== undefined) {
                for (let i = 0; i <= backup.routes.length - 1; i++) {
                    const route_validation = this.validateRoute(backup.routes[i])
                    if (!route_validation.pass) {
                        resolve({pass: false, reason: "Błąd walidacji aut w kopii zapasowej [Route]", errCode: "BACKUP-VALIDATION-ERROR"})
                        return
                    }
                }
            } else {
                resolve({ pass: false, reason: "Brak tras w kopii zapasowej!", errCode: "BACKUP-VALIDATION-ERROR" })
            }
            resolve({ pass: true })
        })
    }

    validateCarBrand(car_brand: CarBrand): ValidationResult {
        if (!this.hasValue(car_brand.id, 'string')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format brandID!', errCode: "CAR_BRAND-VALIDATION-ERROR" }
        }
        if (!this.hasValue(car_brand.name, 'string')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format nazwy marki!', errCode: "CAR_BRAND-VALIDATION-ERROR-NAME" }
        }
        if (!this.hasValue(car_brand.brand_image_set.default, 'string')) {
            return { pass: false, reason: 'Nie podano odpowiedno log marki auta!', errCode: "CAR_BRAND-VALIDATION-ERROR-IMAGE" }
        }
        return { pass: true }
    }

    validateCar(car: CarDBModel, checkBrandFromLocalDB = false, brandsList: CarBrand[] = []): Promise<ValidationResult> {
        return new Promise(async resolve => {
            if (!this.hasValue(car.id, 'string')) {
                resolve({ pass: false, reason: 'Błąd walidacji pojazdu, brak carID!', errCode: "CAR-VALIDATION-ERROR" })
            }
            if (this.hasValue(car.brandId, 'string')) {
                if (checkBrandFromLocalDB) {
                    let brandIDExists = false
                    brandsList.forEach( brand => {
                        if (brand.id === car.brandId) {
                            brandIDExists = true
                        }
                    })
                    if (!brandIDExists) {
                        resolve({ pass: false, reason: 'Nie znaleziono w DB tego brandID!', errCode: "CAR-VALIDATION-ERROR-BRAND_NOT_FOUND" })
                    }
                } else {
                    const carBrandsID = await this.DB.getAllObject<CarBrand>(this.DB_STORES.carBrands)
                    let brandIDExists = false
                    carBrandsID.forEach(
                        brand => {
                            if (brand.id === car.brandId) {
                                brandIDExists = true
                            }
                        }
                    )
                    if (!brandIDExists) {
                        resolve({ pass: false, reason: 'Nie znaleziono w DB tego brandID!', errCode: "CAR-VALIDATION-ERROR-BRAND_NOT_FOUND" })
                    }
                }
            } else {
                resolve({ pass: false, reason: 'Nie podano lub nieprawidłowy format brandID!', errCode: "CAR-VALIDATION-ERROR-BRAND" })
            }
            if (!this.hasValue(car.model, 'string')) {
                resolve({ pass: false, reason: 'Nie podano lub nieprawidłowy format modelu!', errCode: "CAR-VALIDATION-ERROR-MODEL" })
            }
            if (car.mileage.actual === null || car.mileage.actual === undefined || car.mileage.at_review === null || car.mileage.at_review === undefined) {
                resolve({ pass: false, reason: 'Nie podano lub nieprawidłowy format przebiegu!', errCode: "CAR-VALIDATION-ERROR-MILEAGE" })
            }
            if (!(car.type === "Combustion" || car.type === 'Electric' || car.type === 'Hybrid')) {
                resolve({ pass: false, reason: "Nie podano lub nieprawidłowy format typu pojazdu!", errCode: "CAR-VALIDATION-ERROR-TYPE" })
            }
            //* VALIDATION CAR ENGINES
            switch (car.type) {
                case "Hybrid":
                    const combEngValidResult = this.validateCombustionEngine(car.engine.combustion)
                    const elecEngValidResult = this.validateElectricEngine(car.engine.electric)
                    if (!combEngValidResult.pass) {
                        resolve({ pass: false, reason: combEngValidResult.reason, errCode: combEngValidResult.errCode })
                    }
                    if (!elecEngValidResult.pass) {
                        resolve({ pass: false, reason: elecEngValidResult.reason, errCode: elecEngValidResult.errCode })
                    }
                    break;
                case "Combustion":
                    const cEngValidResult = this.validateCombustionEngine(car.engine.combustion)
                    if (!cEngValidResult.pass) {
                        resolve({ pass: false, reason: cEngValidResult.reason, errCode: cEngValidResult.errCode })
                    }
                    break;
                case "Electric":
                    const eEngValidResult = this.validateElectricEngine(car.engine.electric)
                    if (!eEngValidResult.pass) {
                        resolve({ pass: false, reason: eEngValidResult.reason, errCode: eEngValidResult.errCode })
                    }
                    break;
            }
            const gearboxValidResult = this.validateGearbox(car.gearbox)
            if (!gearboxValidResult.pass) {
                resolve({ pass: false, reason: gearboxValidResult.reason, errCode: gearboxValidResult.errCode })
            }
            if (!(car.drive_type === 'AWD' || car.drive_type === 'FWD' || car.drive_type === "RWD")) {
                resolve({ pass: false, reason: "Nie podano lub nieprawidłowy format rodzaju napędu!", errCode: "CAR-VALIDATION-ERROR-DRIVE_TYPE" })
            }
            const insuranceValidResult = this.validateInsurance(car.insurance)
            if (!insuranceValidResult.pass) {
                resolve({ pass: false, reason: insuranceValidResult.reason, errCode: insuranceValidResult.errCode })
            }
            if (!this.hasValue(car.tech_review_ends, 'string')) {
                resolve({ pass: false, reason: "Nie podano lub nieprawidłowy format daty końca przeglądu!", errCode: "CAR-VALIDATION-ERROR-TECH_REVIEW_END_DATE" })
            }
            if (!this.hasValue(car.color.accent, 'string') || !this.hasValue(car.color.theme, 'string')) {
                resolve({ pass: false, reason: "Nie podano lub nieprawidłowy format kolorów motywu auta!", errCode: "CAR-VALIDATION-ERROR-COLOR" })
            }
            if (!this.hasValue(car.photo.side, 'string')) {
                resolve({ pass: false, reason: 'Nie podano lub nieprawidłowy format zdjęcia z boku auta!', errCode: "CAR-VALIDATION-ERROR-PHOTO_SIDE" })
            }
            if (!this.hasValue(car.photo.front_left, 'string')) {
                resolve({ pass: false, reason: 'Nie podano lub nieprawidłowy format zdjęcia z lewego przodu auta!', errCode: "CAR-VALIDATION-ERROR-PHOTO_FRONT_LEFT" })
            }
            resolve({ pass: true })
        })
    }

    validateCombustionEngine(engine: CombustionEngine): ValidationResult {
        if (!this.hasValue(engine.power, 'number')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format mocy silnika!', errCode: "ENGINE-VALIDATION-ERROR-POWER" }
        }
        if (!this.hasValue(engine.torque, 'number')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format moment obrotowy silnika!', errCode: "ENGINE-VALIDATION-ERROR-TORQUE" }
        }
        if (!this.hasValue(engine.volume, 'number')) {
            return { pass: false, reason: 'Nie poadno lub nieprawidłowy formar pojemności silnika spalinowego', errCode: "ENGINE-VALIDATION-ERROR-VOLUME" }
        }
        if (!this.hasValue(engine.avg_fuel_usage, 'number')) {
            return { pass: false, reason: 'Nie poadno lub nieprawidłowy formar średniego spalania silnika spalinowego', errCode: "ENGINE-VALIDATION-ERROR-AVG_USAGE" }
        }
        if (!(engine.fuel_type === 'B' || engine.fuel_type === 'D')) {
            return { pass: false, reason: 'Nie poadno lub nieprawidłowy formar paliwa silnika spalinowego', errCode: "ENGINE-VALIDATION-ERROR-FUEL_TYPE" }
        }
        if (!this.hasValue(engine.fuel_tank_volume, 'number')) {
            return {pass: false, reason: "Nie podano lub nieprawidłowy format pojemności baku", errCode: "CAR-VALIDATION-ERROR-FUEL_TANK_VOLUME"}
        }
        if (!this.hasValue(engine.piston_amount, 'number')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format ilości tłoków!', errCode: "ENGINE-VALIDATION-ERROR-PISTON_AMOUNT" }
        }
        if (!(engine.piston_design === "B" || engine.piston_design === "R" || engine.piston_design === "V")) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format rodzaju ułozenia tłoków!', errCode: "ENGINE-VALIDATION-ERROR-PISTON_DESIGN" }
        }
        return { pass: true }
    }

    validateElectricEngine(engine: ElectricEngine): ValidationResult {
        if (!(engine.energy_storage === 'B' || engine.energy_storage === 'H')) {
            return { pass: false, reason: "Nie podano lub nieprawidłowy format rodzaju energii do silnika elektrycznego!", errCode: "ENGINE-VALIDATION-ERROR-ENERGY_SOURCE" }
        }
        if (!this.hasValue(engine.energy_storage_volume, 'number')) {
            return { pass: false, reason: "Nie podano lub nieprawidłowy format pojemności magazynu energi do silnika elektrycznego!", errCode: "ENGINE-VALIDATION-ERROR-ENERGY_SOURCE_VOLUME" }
        }
        if (!this.hasValue(engine.energy_avg_usage, 'number')) {
            return { pass: false, reason: "Nie podano lub nieprawidłowy format średniego zużycia energi do silnika elektrycznego!", errCode: "ENGINE-VALIDATION-ERROR-ENERGY_AVG_USAGE" }
        }
        if (!this.hasValue(engine.power, 'number')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format mocy silnika!', errCode: "ENGINE-VALIDATION-ERROR-POWER" }
        }
        if (!this.hasValue(engine.torque, 'number')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format moment obrotowy silnika!', errCode: "ENGINE-VALIDATION-ERROR-TORQUE" }
        }
        return { pass: true }
    }

    validateGearbox(gearbox: Gearbox): ValidationResult {
        if (!this.hasValue(gearbox.gears_amount, 'number')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format ilości biegów!', errCode: "GEARBOX-VALIDATION-ERROR-GEARS_AMOUNT" }
        }
        if (!(gearbox.type === "AT" || gearbox.type === "MT" || gearbox.type === 'AT-CVT')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format typu skrzyni biegów!', errCode: "GEARBOX-VALIDATION-ERROR-GEAR_TYPE" }
        }
        return { pass: true }
    }

    validateInsurance(insurance: Insurance): ValidationResult {
        if (!this.hasValue(insurance.name, 'string')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format nazwy ubezpieczyciela!', errCode: 'INSURANCE-VALIDATION-ERROR-NAME' }
        }
        if (!this.hasValue(insurance.start_date, 'string')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format daty startu ubezpieczenia!', errCode: 'INSURANCE-VALIDATION-ERROR-START_DATE' }
        }
        if (!this.hasValue(insurance.ends_date, 'string')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format daty końca ubezpieczenia!', errCode: "INSURANCE-VALIDATION-ERROR-END_DATE" }
        }
        return { pass: true }
    }

    public validateRoute(route: Route): ValidationResult {
        if (!this.hasValue(route.id, 'string')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format routeID!', errCode: "ROUTE-VALIDATION-ERROR" }
        }
        if (!this.hasValue(route.carID, 'string')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format carID!', errCode: "ROUTE-VALIDATION-ERROR" }
        }
        if (!this.hasValue(route.date, 'string')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format daty trasy!', errCode: "ROUTE-VALDIATION-ERROR-DATE" }
        }
        if (!this.hasValue(route.distance, 'number')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format dystansu trasy!', errCode: "ROUTE-VALIDATION-ERROR-DISTANCE" }
        }
        if (!this.hasValue(route.original_avg_fuel_usage, 'number')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format oryginalnego spalania na trasie!', errCode: "ROUTE-VALIDATION-ERROR-ORIGINAL_AVG_USAGE" }
        }
        if (route.usage.combustion.ratio && !this.hasValue(route.usage.combustion.amount, 'number')) {
            return { pass: false, reason: 'Spalanie silnika spalinowego zerowe chociaż uwzględniane w obliczeniach!', errCode: 'ROUTE-VALIDATION-ERROR-COMBUSTION_HAS_ZERO_VALUE' }
        }
        if (route.usage.electric.ratio && !this.hasValue(route.usage.electric.amount, 'number')) {
            return { pass: false, reason: 'Zużycie energii silnika elektrycznego zerowe chociaż uwzględniane w obliczeniach!', errCode: 'ROUTE-VALIDATION-ERROR-COMBUSTION_HAS_ZERO_VALUE' }
        }
        return { pass: true }
    }

    private hasValue(variable: number | string, typeOf: 'string' | 'number'): boolean {
        switch (typeOf) {
            case "string":
                if (variable === '' || variable === undefined || variable === null) {
                    return false
                }
                return true
            case "number":
                if (variable === 0 || variable === undefined || variable === null) {
                    return false
                }
                return true
        }
    }
}

export type ValidationResult = { pass: boolean; reason?: string, errCode?: ErrorID }