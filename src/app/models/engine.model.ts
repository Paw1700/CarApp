//! ID NOT NEEDED - THIS MODEL IS NOT USED SEPERATE IN DB
export class CombustionEngine {
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
//! ID NOT NEEDED - THIS MODEL IS NOT USED SEPERATE IN DB
export class ElectricEngine {
    constructor(
        public energyStorage: 'H' | 'B' = 'B',
        public energyStorageVolume: number = 0,
        public energyAvgUsage: number = 0,
        public power: number = 0,
        public torque: number = 0
    ) { }
}