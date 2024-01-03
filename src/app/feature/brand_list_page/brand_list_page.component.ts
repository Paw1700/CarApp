import { Component, OnInit, inject } from "@angular/core";
import { TitleBar } from "../../UI/title_bar/title_bar.component";
import { AppService } from "../../service";
import { CarBrand } from "../../models/car_brand.model";
import { BrandListItem } from "./components/brand_list_item.component";
import { ButtonComponent } from "../../UI/button/button.component";

@Component({
    selector: 'brand-list-page',
    standalone: true,
    imports: [TitleBar, BrandListItem, ButtonComponent],
    templateUrl: './brand_list_page.component.html',
    styleUrl: './brand_list_page.component.scss'
})
export class BrandListPage implements OnInit{
    APP = inject(AppService)

    dark_mode = false
    brands: CarBrand[] = []
    btn_dimensions = {
        width: 89,
        height: 12.5,
        border_radius: 2.5
    }
    plus_image_height = this.btn_dimensions.height * 0.8

    async ngOnInit() {
        this.brands = await this.APP.DATA.CAR_BRAND.getAll()
        this.dark_mode = this.APP.APPERANCE.checkIsDarkMode()
    }
}