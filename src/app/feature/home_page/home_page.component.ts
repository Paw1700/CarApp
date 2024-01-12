import { Component, OnInit, inject } from "@angular/core";
import { AppService } from "../../service";
import { NotChoosedCarComponent } from "../../UI/not_choosed_car/not_choosed_car.component";
import { CarHomePage } from "./car_home_page/car_home_page.component";

@Component({
    selector: 'home-page',
    standalone: true,
    templateUrl: './home_page.component.html',
    styleUrl: './home_page.component.scss',
    imports: [NotChoosedCarComponent, CarHomePage]
})
export class HomePage implements OnInit{
    APP = inject(AppService)
    choosed_car_id: string | null = null

    async ngOnInit(): Promise<void> {
        this.choosed_car_id = this.APP.DATA.getChoosedCarID()
    }

    navigateToCarList() {
        this.APP.navigate('carsList')
    }
}