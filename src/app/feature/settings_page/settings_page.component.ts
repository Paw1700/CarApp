import { Component, inject } from "@angular/core";
import { TitleBar } from "../../UI/title_bar/title_bar.component";
import { ButtonComponent } from "../../UI/button/button.component";
import { FuelConfigEditComponent } from "./components/fuel_config_edit.component";
import { AppService } from "../../service";

@Component({
    selector: 'settings-page',
    standalone: true,
    imports: [TitleBar, ButtonComponent, FuelConfigEditComponent],
    templateUrl: './settings_page.component.html',
    styleUrl: './settings_page.component.scss'
})
export class SettingsPage {
    APP = inject(AppService)

    btn_dimenstion = {
        width: 86.5,
        height: 10.17,
        border_radius: 2.5
    }
}