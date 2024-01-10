import { CarBrand } from "./car_brand.model";
import { CarDBModel } from "./car.model";
import { Route } from "./route.model";

export class Backup {
    constructor(
        public appVersion: string = '',
        public creationDate: string = '',
        public choosedCarID: string | null = null,
        public fuelCalcConfig: number | null = null,
        public igd: {id: string, storeName: string, indexesPoll: number[]}[] = [],
        public carBrands: CarBrand[] = [], 
        public cars: CarDBModel[] = [],
        public routes: Route[] = []
    ) { }
}