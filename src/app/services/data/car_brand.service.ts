import { Injectable } from "@angular/core";
import { DatabaseManager } from "../../util/db.driver";
import { DB_STORES } from "./_main.service";
import { CarBrand } from "../../models/car_brand.model";
import { AppValidator } from "../validator.service";

@Injectable()
export class CarBrandService {
    constructor(private DB: DatabaseManager, private VALIDATOR: AppValidator) { }

    private readonly DB_STORE = new DB_STORES().carBrands

    /**
     * @param brandID id of brand you want get
     * @returns brand data if exist
     */
    getOne(brandID: string): Promise<CarBrand> {
        return this.DB.getObject<CarBrand>(this.DB_STORE, brandID)
    }

    /**
     * @returns all car brand in DB in alphabetic order
     */
    getAll(): Promise<CarBrand[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let carBrandArray = await this.DB.getAllObject<CarBrand>(this.DB_STORE)
                carBrandArray = carBrandArray.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1
                    }
                    if (a.name > b.name) {
                        return 1
                    }
                    return 0
                })
                resolve(carBrandArray)
            } catch {
                reject("CAR_BRAND-GET-ERROR")
            }
        })
    }

    /**
     * It's validates and saves brand data to DB
     * @param brand data of brand
     * @param updateMode if true it will replace old data of given brand data, otherwise it create new brand in DB
     */
    saveOne(brand: CarBrand, updateMode: boolean = false): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!updateMode) {
                brand.id = await this.DB.GENERATE_INDEX(this.DB_STORE)
            }
            const validation_result = this.VALIDATOR.validateCarBrand(brand)
            if (validation_result.pass) {
                try {
                    await this.DB.insertObject(this.DB_STORE, brand)
                    resolve()
                } catch {
                    reject("CAR_BRAND-SAVE-ERROR")
                }
            } else {
                if (!updateMode) {
                    await this.DB.RELEASE_INDEX(this.DB_STORE, brand.id)
                }
                console.error(validation_result.reason)
                reject(validation_result.errCode)
            }
        })
    }

    /**
     * Deletes brand in DB
     * @param brandID id of brand you want to delete
     */
    deleteOne(brandID: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.DB.RELEASE_INDEX(this.DB_STORE, brandID)
                await this.DB.deleteObject(this.DB_STORE, brandID)
                resolve()
            } catch (err) {
                reject("CAR_BRAND-DELETE-ERROR")
            }
        })
    }
}