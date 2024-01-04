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
            actual: number,
            at_review: number
        } = {
            actual: 0,
            at_review: 0
        },
        public type: CarType | '' = '',
        public engine: {
            combustion: CombustionEngine,
            electric: ElectricEngine
        } = {
            combustion: new CombustionEngine(), 
            electric: new ElectricEngine()
        },
        public gearbox: Gearbox = new Gearbox(),
        public drive_type: GearboxDriveType | '' = "",
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

export class Car {
    constructor(
        public id: string = '',
        public brand: CarBrand = new CarBrand(),
        public model: string = '',
        public mileage: {
            actual: number,
            at_review: number
        } = {
            actual: 0,
            at_review: 0
        },
        public type: CarType | '' = 'Hybrid',
        public engine: {
            combustion: CombustionEngine,
            electric: ElectricEngine
        } = {
            combustion: new CombustionEngine(), 
            electric: new ElectricEngine()
        },
        public gearbox: Gearbox = new Gearbox(),
        public drive_type: GearboxDriveType | '' = "AWD",
        public insurance: Insurance = new Insurance(),
        public tech_review_ends: string = '',
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

    // get InsuranceValidByXDays(): number {
    //     const actualDate = new Date().getTime()
    //     const endDate = new Date(this.insurance.endsDate).getTime()

    //     const diff = endDate - actualDate

    //     return +((diff/1000)/60/60/24).toFixed(0)
    // }

    // get InsuranceEndDate(): string {
    //     return new Date(this.insurance.endsDate).toLocaleDateString()
    // }

    // get TechnicalReviewValidByXDays(): number {
    //     const actualDate = new Date().getTime()
    //     const endDate = new Date(this.tech_review_ends).getTime()

    //     const diff = endDate - actualDate

    //     return +((diff/1000)/60/60/24).toFixed(0)
    // }

    // get TechnicalReviewEndDate(): string {
    //     return new Date(this.tech_review_ends).toLocaleDateString()
    // }
}

