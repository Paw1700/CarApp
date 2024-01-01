export class CarBrand {
    constructor(
        public id: string = '',
        public name: string = '',
        public brand_image_set: {
            default: string,
            for_dark_mode: string | null
        } = {
            default: '',
            for_dark_mode: null
        }
    ) { }
}