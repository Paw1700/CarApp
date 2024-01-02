import { Injectable } from '@angular/core';
import { DatabaseManager } from '../../util/db.driver';
import ERRORS_JSON from '../../data/errors.json';
import { ErrorID } from '../../models/error.model';
import { ErrorModel } from '../../models/error.model';
import { CarBrandService } from './car_brand.service';
import { CarService } from './car.service';
import { RouteService } from './routes.service';

export class DB_STORES {
    constructor(
        public carBrands: string = 'carBrands',
        public cars: string = 'cars',
        public routes: string = 'routes'
    ) {}
}

export class LS_STORES {
    constructor(
        public choosedCarID = 'choosedCarID',
        public usedAppVersion = 'usedAppVersion',
        public fuelConfigAvgUsage = 'fuelConfigAvgUsage'
    ) {}
}

@Injectable()
export class AppData {
    constructor(
        private DB: DatabaseManager,
        public CAR_BRAND: CarBrandService,
        public CAR: CarService,
        public ROUTE: RouteService
    ) {}

    private readonly DB_NAME = 'CarApp';
    private readonly DB_VERSION = 1;
    private readonly DB_STORES = new DB_STORES();
    private readonly LS_STORES = new LS_STORES();
    private readonly ERRORS: ErrorModel[] = ERRORS_JSON;

    /**
     * It's start application data system. If failed it returns error code in reject.
     */
    start(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.DB.initLS(Object.getOwnPropertyNames(this.LS_STORES));
            try {
                this.DB.initDB(
                    this.DB_NAME,
                    this.DB_VERSION,
                    Object.getOwnPropertyNames(this.DB_STORES)
                );
                resolve();
            } catch {
                reject('DB-CONNECT-ERROR');
            }
        });
    }

    /**
     * That function deletes all application data. If failed it returns error code in reject.
     */
    reset(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                this.DB.clearLS();
                await this.DB.deleteDB(this.DB_NAME);
                resolve();
            } catch {
                reject('APP-RESET-ERROR');
            }
        });
    }

    /**
     * It's saves app version to localStorage
     * @param version string of version you want to save or null if you want clear it
     */
    saveAppVersion(version: string | null): void {
        if (version === null) {
            version = '';
        }
        this.DB.LS_insertData(this.LS_STORES.usedAppVersion, version);
    }

    /**
     * @returns saved app version in string or null if it wasn't saved
     */
    getAppVersion(): string | null {
        return this.DB.LS_getData(this.LS_STORES.usedAppVersion);
    }

    /**
     * @returns choosed car id in application in form of string, if there is not choosed one it returns null
     */
    getChoosedCarID(): string | null {
        const id = this.DB.LS_getData(this.LS_STORES.choosedCarID);
        if (id !== '' && id !== null) {
            return id;
        } else {
            return null;
        }
    }

    /**
     * It's saves car id you want to select as used actually
     * @param carID id of car or null if want to deselect
     */
    saveChoosedCarID(carID: string | null): void {
        if (carID === null) {
            carID = '';
        }
        this.DB.LS_insertData(this.LS_STORES.choosedCarID, carID);
    }

    /**
     * @param errID id of error you want get
     * @returns error if exist some error data connect wit errID
     */
    getError(errID: ErrorID): ErrorModel | undefined {
        return this.ERRORS.find((err) => err.id === errID);
    }

    /**
     * Sets fuel config value in DB
     * @param fuel_config value of average car usage
     */
    saveFuelConfig(fuel_config: number): void {
        this.DB.LS_insertData(
            this.LS_STORES.fuelConfigAvgUsage,
            fuel_config.toFixed(1)
        );
    }

    /**
     * @returns value of fuel config
     */
    getFuelConfig(): number | null {
        const fc_value = this.DB.LS_getData(this.LS_STORES.fuelConfigAvgUsage);
        if (fc_value === null || fc_value === '' || Number.isNaN(fc_value)) {
            return null;
        } else {
            return Number(fc_value);
        }
    }

    //? getIGD and setIGD maybe not be necesary
}
