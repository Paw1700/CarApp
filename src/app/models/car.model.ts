import { CarBrand } from "./car_brand.model"
import { CombustionEngine, ElectricEngine } from "./engine.model"
import { Gearbox } from "./gearbox.model"
import { Insurance } from "./insurance.model"

export type GearboxDriveType = "AWD" | "FWD" | "RWD"

export type SourceType = 'Combustion' | 'Electric'

export type CarType = SourceType | 'Hybrid'

export class CarDBModel {
    constructor(
        public id: string = '',
        public brandId: string = '',
        public model: string = '',
        public mileage: {
            actual: number | null,
            at_review: number | null
        } = {
            actual: null,
            at_review: null
        },
        public type: CarType | null = null,
        public engine: {
            combustion: CombustionEngine,
            electric: ElectricEngine
        } = {
            combustion: new CombustionEngine(), 
            electric: new ElectricEngine()
        },
        public energySourceData: {
            combustion: {
                avaibleAmount: number
            },
            electric: {
                avaibleAmount: number,
                chargingStartAt: Date | null,
                chargingPower: number | null,
            }
        } = {
            combustion: {
                avaibleAmount: 0
            },
            electric: {
                avaibleAmount: 0,
                chargingStartAt: null,
                chargingPower: null
            }
        },
        public gearbox: Gearbox = new Gearbox(),
        public drive_type: GearboxDriveType | null = null,
        public insurance: Insurance = new Insurance(),
        public tech_review_ends: string = new Date().toJSON().substring(0, 10),
        public color: {
            theme: string,
            accent: string
        } = {
            theme: '#000000',
            accent: '#000000'
        },
        public photo: {
            side: string, 
            front_left: string
        } = {
            side: '',
            front_left: ''
        }
    ) { }
}

export class Car extends CarDBModel {
    constructor(
        public car: CarDBModel = new CarDBModel(),
        public brand: CarBrand = new CarBrand()
    ) {
        super(car.id, car.brandId, car.model, car.mileage, car.type, car.engine, car.energySourceData, car.gearbox, car.drive_type, car.insurance, car.tech_review_ends, car.color, car.photo)
    }
}
