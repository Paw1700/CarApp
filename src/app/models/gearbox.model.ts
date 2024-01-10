export class Gearbox {
    constructor(
        public type: GearboxType | null = null,
        public gears_amount: number = 0 
    ) { }
}

export type GearboxType = "AT" | "AT-CVT" | "MT"