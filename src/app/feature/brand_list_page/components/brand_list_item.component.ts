import { Component, Input, OnInit } from '@angular/core';
import { CarBrand } from '../../../models/car_brand.model';

@Component({
    selector: 'brand-list-item',
    standalone: true,
    template: `
        <div class="COMPONENT">
            <img class="BRAND_IMAGE" [src]="brand_image" />
        </div>
    `,
    styles: `
        div.COMPONENT {
            width: 100%;

            img.BRAND_IMAGE {
                
            }
        }
    `,
})
export class BrandListItem implements OnInit{
    @Input({ required: true }) dark_mode_bool: boolean = false;
    @Input({ required: true }) car_brand: CarBrand = new CarBrand();
    brand_image = ''

    ngOnInit(): void {
        if (this.dark_mode_bool && this.car_brand.brand_image_set.for_dark_mode !== null) {
            this.brand_image = this.car_brand.brand_image_set.for_dark_mode
        } else {
            this.brand_image = this.car_brand.brand_image_set.default
        }
    }
}
