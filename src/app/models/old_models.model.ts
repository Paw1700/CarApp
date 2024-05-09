//*
//* V2.0.5 DB Data MODELS
//*


export class Backup_V2_0_5 {
    constructor(
        public APP_VERSION_ID: string,
        public BACKUP_CREATED_TIME: string,
        public storesArray: string[],
        public choosedCarID: string | null,
        public FuelCalcConfing: number,
        public IGD: {id: string, storeName: string, indexesPoll: number[]}[],
        public CarBrands: {indexInIGD: number, data: CarBrand_V_2_0_5[]},
        public Cars: {indexInIGD: number, data: CarDBModel_V_2_0_5[]},
        public Insurances: {indexInIGD: number, data: Insurance_V_2_0_5[]}, 
        public Gearboxes: {indexInIGD: number, data: Gearbox_V_2_0_5[]},
        public Engines: {indexInIGD: number, data: Engine_V_2_0_5[]},
        public Routes: {indexInIGD: number, data: Route_V_2_0_5[]},
    ) { }
}

export class CarBrand_V_2_0_5 {
    constructor(
        public id: string = '',
        public name: string = '',
        public brandImage: {
            light: string,
            dark: string
        } = {
            light: '',
            dark: ''
        }
    ) { }
}

export class CarDBModel_V_2_0_5 {
    constructor(
        public id: string = '',
        public brandID: string = '',
        public model: string = '',
        public mileage: number = 0,
        public engineID: string = '',
        public fuelTankVolume: number = 0,
        public avgManufactureFuelUsage: number = 0,
        public gearboxID: string = '',
        public driveType: "AWD" | "FWD" | "RWD" = "AWD",
        public insuranceID: string = '',
        public techReviewEnds: string = '',
        public mileageAtReview: number = 0,
        public themeColor: string = '#000000',
        public accentColor: string = '#000000',
        public photo: {
            side: string, 
            frontLeft: string
        } = {
            side: '',
            frontLeft: ''
        }
    ) { }
}

export class Engine_V_2_0_5 {
    constructor(
        public id: string = '',
        public volume: number = 0,
        public pistonDesign: "R" | "V" | "B" = "R",
        public pistonAmount: number = 0,
        public fuelType: "B" | "D" = "B",
        public power: number = 0,
        public torque: number = 0
    ) { }
}

export class Gearbox_V_2_0_5 {
    constructor(
        public id: string = '',
        public type: "AT" | "MT" = "AT",
        public gearsAmount: number = 0 
    ) { }
}

export class Insurance_V_2_0_5 {
    constructor(
        public id: string = '',
        public name: string = '',
        public startDate: string =  '',
        public endsDate: string = '',
        public options: {
            AC: boolean,
            NWW: boolean,
            Assistance: boolean
        } = {
            AC: false,
            NWW: false,
            Assistance: false
        }
    ) { }
}

export class Route_V_2_0_5 {
    constructor(
        public id: string = '',
        public carID: string = '',
        public date: string = '',
        public distance: number = 0,
        public avgFuelUsage: number = 0,
        public originalAvgFuelUsage: number = 0
    ) { }
}


//*
//* V2.1.3 DB Data Models 
//*


export class Backup_V_2_1_3 {
    constructor(
        public appVersion: string = '',
        public creationDate: string = '',
        public choosedCarID: string | null = null,
        public fuelCalcConfig: number | null = null,
        public igd: {id: string, storeName: string, indexesPoll: number[]}[] = [],
        public carBrands: CarBrand_V_2_1_3[] = [], 
        public cars: CarDBModel_V_2_1_3[] = [],
        public routes: Route_V_2_1_3[] = []
    ) { }
}

export class CarBrand_V_2_1_3 {
    constructor(
        public id: string = '',
        public name: string = '',
        public brandImageSet: {
            default: string,
            forDarkMode: string | null
        } = {
            default: '',
            forDarkMode: null
        }
    ) { }
}

export class CarDBModel_V_2_1_3 {
    constructor(
        public id: string = '',
        public brandId: string = '',
        public model: string = '',
        public mileage: {
            actual: number,
            atReview: number
        } = {
            actual: 0,
            atReview: 0
        },
        public type: "Hybrid" | "Combustion" | "Electric" = 'Hybrid',
        public engine: {
            combustion: CombustionEngine_V_2_1_3,
            electric: ElectricEngine_V_2_1_3
        } = {
            combustion: new CombustionEngine_V_2_1_3(), 
            electric: new ElectricEngine_V_2_1_3()
        },
        public gearbox: Gearbox_V_2_1_3 = new Gearbox_V_2_1_3(),
        public driveType: "AWD" | "FWD" | "RWD" = "AWD",
        public insurance: Insurance_V_2_1_3 = new Insurance_V_2_1_3(),
        public techReviewEnds: string = '',
        public color: {
            theme: string,
            accent: string
        } = {
            theme: '#000000',
            accent: '#000000'
        },
        public photo: {
            side: string, 
            frontLeft: string
        } = {
            side: '',
            frontLeft: ''
        }
    ) { }
}

export class CombustionEngine_V_2_1_3 {
    constructor(
        public volume: number = 0,
        public pistonDesign: "R" | "V" | "B" = "R",
        public pistonAmount: number = 0,
        public fuelType: "B" | "D" = "B",
        public fuelTankVolume: number = 0,
        public avgFuelUsage: number = 0,
        public power: number = 0,
        public torque: number = 0
    ) { }
}

export class ElectricEngine_V_2_1_3 {
    constructor(
        public energyStorage: 'H' | 'B' = 'B',
        public energyStorageVolume: number = 0,
        public energyAvgUsage: number = 0,
        public power: number = 0,
        public torque: number = 0
    ) { }
}

export class Gearbox_V_2_1_3 {
    constructor(
        public type: "AT" | "AT-CVT" | "MT" = "AT",
        public gearsAmount: number = 0 
    ) { }
}

export class Insurance_V_2_1_3 {
    constructor(
        public name: string = '',
        public startDate: string =  '',
        public endsDate: string = '',
        public options: {
            AC: boolean,
            NWW: boolean,
            Assistance: boolean
        } = {
            AC: false,
            NWW: false,
            Assistance: false
        }
    ) { }
}

export class Route_V_2_1_3 {
    constructor(
        public id: string = '',
        public carID: string = '',
        public date: string = '',
        public originalAvgFuelUsage: number = 0,
        public distance: number = 0,
        public usage: {
            combustion: {
                include: boolean,
                amount: number
            },
            electric: {
                include: boolean,
                amount: number
            }
        } = {
            combustion: {
                include: false,
                amount: 0
            },
            electric: {
                include: false,
                amount: 0
            }
        }
    ) { }
}


//*
//* V2.2.0 DB Data Models 
//*


export class Backup_V_2_2_0 {
    constructor(
        public appVersion: string = '',
        public creationDate: string = '',
        public choosedCarID: string | null = null,
        public fuelCalcConfig: number | null = null,
        public igd: {id: string, storeName: string, indexesPoll: number[]}[] = [],
        public carBrands: CarBrand_V_2_2_0[] = [], 
        public cars: CarDBModel_V_2_2_0[] = [],
        public routes: Route_V_2_2_0[] = []
    ) { }
}

export class CarBrand_V_2_2_0 {
    constructor(
        public id: string = '',
        public name: string = '',
        public brand_image_set: {
            default: string,
            for_dark_mode: string | null
        } = {
            default: '',
            for_dark_mode: null
        }
    ) { }
}

export class CarDBModel_V_2_2_0 {
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
        public type: 'Combustion' | 'Electric' | 'Hybrid' | null = null,
        public engine: {
            combustion: CombustionEngine_V_2_2_0,
            electric: ElectricEngine_V_2_2_0
        } = {
            combustion: new CombustionEngine_V_2_2_0(), 
            electric: new ElectricEngine_V_2_2_0()
        },
        public gearbox: Gearbox_V_2_2_0 = new Gearbox_V_2_2_0(),
        public drive_type: "AWD" | "FWD" | "RWD" | null = null,
        public insurance: Insurance_V_2_2_0 = new Insurance_V_2_2_0(),
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

export class CombustionEngine_V_2_2_0 {
    constructor(
        public volume: number = 0,
        public piston_design: "R" | "V" | "B" | null = null,
        public piston_amount: number = 0,
        public fuel_type: "B" | "D" | null = null,
        public fuel_tank_volume: number = 0,
        public avg_fuel_usage: number = 0,
        public power: number = 0,
        public torque: number = 0
    ) { }
}

export class ElectricEngine_V_2_2_0 {
    constructor(
        public energy_storage: 'H' | 'B' | null = null,
        public energy_storage_volume: number = 0,
        public energy_avg_usage: number = 0,
        public power: number = 0,
        public torque: number = 0
    ) { }
}

export class Gearbox_V_2_2_0 {
    constructor(
        public type: "AT" | "AT-CVT" | "MT" | null = null,
        public gears_amount: number = 0 
    ) { }
}

export class Insurance_V_2_2_0 {
    constructor(
        public name: string = '',
        public start_date: string =  new Date().toJSON().substring(0, 10),
        public ends_date: string = new Date().toJSON().substring(0, 10),
        public options: {
            AC: boolean,
            NWW: boolean,
            Assistance: boolean
        } = {
            AC: false,
            NWW: false,
            Assistance: false
        }
    ) { }
}

export class Route_V_2_2_0 {
    constructor(
        public id: string = '',
        public carID: string = '',
        public date: string = '',
        public original_avg_fuel_usage: number = 0,
        public distance: number = 0,
        public usage: {
            combustion: {
                include: boolean,
                amount: number
            },
            electric: {
                include: boolean,
                amount: number
            }
        } = {
            combustion: {
                include: false,
                amount: 0
            },
            electric: {
                include: false,
                amount: 0
            }
        }
    ) { }
}