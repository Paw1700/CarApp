export class CarBrand {
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