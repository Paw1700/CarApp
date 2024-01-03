import { Component, Input, OnInit } from '@angular/core';
import { CarBrand } from '../../../models/car_brand.model';

@Component({
    selector: 'brand-list-item',
    standalone: true,
    template: `
        <div class="COMPONENT">
            <div class="BRAND">
                <img class="BRAND_IMAGE" [src]="brand_image" />
                <p class="BRAND_NAME">{{ car_brand.name }}</p>
            </div>
        </div>
    `,
    styles: `
        div.COMPONENT {
            width: 100%;
            height: 20vw;
            display: flex;
            position: relative;
            flex-direction: row;
            height: 20vw;
            left: 0;
            transition: 0.2s ease-out;
                
            div.BRAND {
                min-height: 20vw;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: row;
                min-width: 100%;
                gap: 2.5vw;
                
                img.BRAND_IMAGE {
                    width: 15vw;
                    object-fit: contain;
                }
                
                p.BRAND_NAME {
                    font-size: 1.25rem;
                    font-weight: 500;
                    width: 70%;
                    text-align: center;
                }
            }
        }
            
    `,
})
export class BrandListItem implements OnInit {
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
