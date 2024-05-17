export class Route {
    constructor(
        public id: string = '',
        public carID: string = '',
        public date: string = '',
        public original_avg_fuel_usage: number = 0,
        public distance: number = 0,
        public usage: {
            combustion: UsageData,
            electric: UsageData
        } = {
            combustion: {
                ratio: 0,
                amount: 0
            },
            electric: {
                ratio: 0,
                amount: 0
            }
        }
    ) { }
}

export type UsageData = {ratio: number, amount: number}