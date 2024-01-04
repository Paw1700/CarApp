//! ID NOT NEEDED - THIS MODEL IS NOT USED SEPERATE IN DB
export class Insurance {
    constructor(
        public name: string = '',
        public startDate: string =  new Date().toJSON().substring(0, 10),
        public endsDate: string = new Date().toJSON().substring(0, 10),
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