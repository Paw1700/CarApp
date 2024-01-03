import { Component, inject } from "@angular/core";
import { TitleBar } from "../../UI/title_bar/title_bar.component";
import { AppService } from "../../service";
import { LogoPickerComponent } from "./components/logo_picker/logo_picker.component";
import { ButtonComponent, ButtonTypes } from "../../UI/button/button.component";
import { TextInputComponent } from "../../UI/forms/text_input.component";
import { Loader } from "../../UI/loaders/loader.component";
import { CarBrand } from "../../models/car_brand.model";

@Component({
    selector: 'create-brand-page',
    standalone: true,
    imports: [TitleBar, LogoPickerComponent, ButtonComponent, TextInputComponent, Loader],
    templateUrl: './create_brand_page.component.html',
    styleUrl: './create_brand_page.component.scss'
})
export class CreateBrandPage {
    APP = inject(AppService)
    readonly border_dimenions = {
        width: 89,
        height: 12.5,
        border_radius: 2.5,
    }
    btn_type: ButtonTypes = 'accent'
    brand_name: string = '';
    brand_default_logo = '';
    brand_logo_for_dark_mode: string | null = null;
    data_fetching = false;
    error = false;

    handleCarNameInputEmit(name: string) {
        this.brand_name = name;
    }

    handleCarBrandImageEmit(image: string, dark_mode_logo: boolean) {
        if (dark_mode_logo) {
            this.brand_logo_for_dark_mode = image;
        } else {
            this.brand_default_logo = image;
        }
    }

    async saveBrand() {
        try {
            const brand = new CarBrand('', this.brand_name, {default: this.brand_default_logo, for_dark_mode: this.brand_logo_for_dark_mode})
            this.data_fetching = true;
            await this.APP.DATA.CAR_BRAND.saveOne(brand)
            setTimeout(() => {
                this.data_fetching = false;
                this.APP.navigate('carBrands')
            }, 1000)
        } catch (err) {
            //!!! SEND ERROR TO APP SERVICES
            this.data_fetching = false;
            this.toogleError(true);
            setTimeout(() => {
                this.toogleError(false);
            }, 1500) 
        }
    }

    private toogleError(bool: boolean) {
        if (!bool) {
            this.error = false;
            this.btn_type = 'accent'
        } else {
            this.error = true;
            this.btn_type = 'error'
        }
    }
}