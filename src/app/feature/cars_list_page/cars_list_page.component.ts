import { Component, inject } from "@angular/core";
import { TitleBar } from "../../UI/title_bar/title_bar.component";
import { ButtonComponent } from "../../UI/button/button.component";
import { AppService } from "../../service";

@Component({
    selector: 'cars-list',
    standalone: true,
    imports: [TitleBar, ButtonComponent],
    templateUrl: './cars_list_page.component.html',
    styleUrl: './cars_list_page.component.scss'
})
export class CarsListPage {
    APP = inject(AppService)
    btn_dimensions = {
        width: 89,
        height: 12.5,
        border_radius: 2.5
    }
}