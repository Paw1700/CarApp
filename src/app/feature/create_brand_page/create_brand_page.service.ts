import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AppService } from "../../service";
import { CarBrand } from "../../models/car_brand.model";

@Injectable()
export class CreateBrandPageService {
    constructor (private APP: AppService) {
        this.brand_id$.subscribe( async id => {
            if (id !== '') {
                const brand = await this.APP.DATA.CAR_BRAND.getOne(id)
                this.brand_logo_default$.next(brand.brand_image_set.default)
                this.brand_logo_for_dark_mode$.next(brand.brand_image_set.for_dark_mode)
                this.brand_name$.next(brand.name)
            }
        })
    }
    brand_logo_default$ = new BehaviorSubject<string>('')
    brand_logo_for_dark_mode$ = new BehaviorSubject<string | null>(null)
    brand_name$ = new BehaviorSubject<string>('')
    brand_id$ = new BehaviorSubject<string>('')

    async saveBrand() {
        try {
            const brand = new CarBrand(this.brand_id$.value, this.brand_name$.value, {default: this.brand_logo_default$.value, for_dark_mode: this.brand_logo_for_dark_mode$.value})
            await this.APP.DATA.CAR_BRAND.saveOne(brand, this.brand_id$.value !== '' ? true : false)
            setTimeout(() => {
                this.APP.navigate('carBrands')
            }, 50)
        } catch (err) {
            //!!! SEND ERROR TO APP SERVICES
            Promise.reject()
        }
    }
}