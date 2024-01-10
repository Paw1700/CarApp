//! ID NOT NEEDED - THIS MODEL IS NOT USED SEPERATE IN DB
export class Insurance {
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