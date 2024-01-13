import { Component, OnInit, inject } from "@angular/core";
import { TitleBar } from "../../UI/title_bar/title_bar.component";
import { ButtonComponent } from "../../UI/button/button.component";
import { AppService } from "../../service";
import { CarTile } from "./components/car_tile/car_tile.component";
import { Car } from "../../models/car.model";
import { ScrollAbleBar, ScrollBarOption } from "../../UI/scroll_able_bar/scroll_able_bar.component";
import { energySourceStatus } from "../../services/data/car.service";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
    selector: 'cars-list',
    standalone: true,
    imports: [TitleBar, ButtonComponent, CarTile, ScrollAbleBar],
    templateUrl: './cars_list_page.component.html',
    styleUrl: './cars_list_page.component.scss',
    animations: [
        trigger('tile', [
            transition("void => *", [
                style({position: 'relative', bottom: '-2.5vh', opacity: 0}),
                animate("350ms ease-out", style({
                    opacity: 1,
                    bottom: 0
                }))
            ])
        ])
    ]
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
        const ids_are_equal = carID === this.selected_car_id
        this.APP.setChoosedCar(ids_are_equal ? null : carID)
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
            const list_to_set: {car: Car, energy_state: energySourceStatus}[] = []
            if (refresh) {
                this.cars_data = []
            }
            for(let i = 0; i <= cars.length - 1; i++) {
                const car = cars[i]
                const car_energy_state = await this.APP.DATA.CAR.getCarEnergySourceStatus(car.id)
                list_to_set.push({car: car, energy_state: car_energy_state})
            }
            list_to_set.sort((a, b) => {
                if (a.car.model > b.car.model) {
                    return 1
                }
                if (a.car.model < b.car.model) {
                    return -1
                }
                return 0
            })
            list_to_set.sort((a, b) => {
                if (a.car.brand.name > b.car.brand.name) {
                    return 1
                }
                if (a.car.brand.name < b.car.brand.name) {
                    return -1
                }
                return 0
            })
            if (this.selected_car_id !== null) {
                const index_of_chosed_car = list_to_set.findIndex(data => data.car.id === this.selected_car_id)
                const chosed_car = list_to_set[index_of_chosed_car]
                list_to_set.splice(index_of_chosed_car, 1)
                list_to_set.unshift(chosed_car)
            }
            this.cars_data = list_to_set
        } catch (err) {
            console.error(err);
        }
    }
}