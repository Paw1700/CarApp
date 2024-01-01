export class Gearbox {
    constructor(
        public type: "AT" | "AT-CVT" | "MT" = "AT",
        public gearsAmount: number = 0 
    ) { }
}