export class Route {
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

