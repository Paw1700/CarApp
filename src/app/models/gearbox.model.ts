export class Gearbox {
    constructor(
        public type: GearboxType | '' = "",
        public gearsAmount: number = 0 
    ) { }
}

export type GearboxType = "AT" | "AT-CVT" | "MT"