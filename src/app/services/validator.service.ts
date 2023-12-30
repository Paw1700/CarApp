import { DB_STORES } from './data/_main.service';
import { Injectable } from "@angular/core";
import { DatabaseManager } from "../util/db.driver";
import { ErrorID } from '../data/types';
import { CarBrand } from '../models/car_brand.model';

@Injectable()
export class AppValidator {
    constructor(private DB: DatabaseManager) { }

    private readonly DB_STORES = new DB_STORES()

    validateCarBrand(car_brand: CarBrand): ValidationResult {
        if (!this.hasValue(car_brand.id, 'string')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format brandID!', errCode: "CAR_BRAND-VALIDATION-ERROR" }
        }
        if (!this.hasValue(car_brand.name, 'string')) {
            return { pass: false, reason: 'Nie podano lub nieprawidłowy format nazwy marki!', errCode: "CAR_BRAND-VALIDATION-ERROR-NAME" }
        }
        if (!this.hasValue(car_brand.brandImageSet.default, 'string')) {
            return { pass: false, reason: 'Nie podano odpowiedno log marki auta!', errCode: "CAR_BRAND-VALIDATION-ERROR-IMAGE" }
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