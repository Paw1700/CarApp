//! ID NOT NEEDED - THIS MODEL IS NOT USED SEPERATE IN DB
export class CombustionEngine {
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
//! ID NOT NEEDED - THIS MODEL IS NOT USED SEPERATE IN DB
export class ElectricEngine {
    constructor(
        public energy_storage: 'H' | 'B' | null = null,
        public energy_storage_volume: number = 0,
        public energy_avg_usage: number = 0,
        public power: number = 0,
        public torque: number = 0
    ) { }
}