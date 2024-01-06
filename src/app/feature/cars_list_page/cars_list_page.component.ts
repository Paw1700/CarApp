import { Component, OnInit, inject } from "@angular/core";
import { TitleBar } from "../../UI/title_bar/title_bar.component";
import { ButtonComponent } from "../../UI/button/button.component";
import { AppService } from "../../service";
import { CarTile } from "./components/car_tile/car_tile.component";
import { Car } from "../../models/car.model";
import { ScrollAbleBar, ScrollBarOption } from "../../UI/scroll_able_bar/scroll_able_bar.component";
import { energySourceStatus } from "../../services/data/car.service";

@Component({
    selector: 'cars-list',
    standalone: true,
    imports: [TitleBar, ButtonComponent, CarTile, ScrollAbleBar],
    templateUrl: './cars_list_page.component.html',
    styleUrl: './cars_list_page.component.scss'
})
export class CarsListPage implements OnInit{
    APP = inject(AppService)
    btn_dimensions = {
        width: 89,
        height: 12.5,
        border_radius: 2.5
    }
    cars_data: {car: Car, energy_state: energySourceStatus}[] = [] 
    selected_car_id: string | null = null
    left_scroll_bar_opt = new ScrollBarOption('blue', 25, 'EDYTUJ', null)
    right_scroll_bar_opt = new ScrollBarOption('red', 25, 'USUŃ', null)

    ngOnInit(): void {
        this.getCarsData()
    }

    changeSelectedCarID(carID: string) {
        console.log(carID);
        const ids_are_equal = carID === this.selected_car_id
        this.APP.DATA.saveChoosedCarID(ids_are_equal ? null : carID)
        this.selected_car_id = ids_are_equal ? '' : carID
    }

    goToEditCar(carID: string) {
        this.APP.navigate('editCar', carID)
    }

    async deleteCar(carID: string) {
        try {
            if (carID === this.selected_car_id) {
                this.APP.DATA.saveChoosedCarID(null)
                await this.APP.DATA.CAR.deleteOne(carID)
                this.getCarsData(true)
            }
        } catch (err) {
            console.error(err);
        }
    }

    private async getCarsData(refresh = false) {
        try {
            this.selected_car_id = this.APP.DATA.getChoosedCarID()
            const cars = await this.APP.DATA.CAR.getAll() as Car[]
            if (refresh) {
                this.cars_data = []
            }
            for(let i = 0; i <= cars.length - 1; i++) {
                const car = cars[i]
                const car_energy_state = await this.APP.DATA.CAR.getCarEnergySourceStatus(car.id)
                this.cars_data.push({car: car, energy_state: car_energy_state})
            }
        } catch (err) {
            console.error(err);
        }
    }
}