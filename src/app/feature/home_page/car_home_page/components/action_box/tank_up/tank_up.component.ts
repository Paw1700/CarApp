import { Component, OnInit, inject } from "@angular/core";
import { CarHomePageService } from "../../../car_home_page.service";
import { NgUnsubscriber } from "../../../../../../util/ngUnsubscriber";
import { energySourceStatus } from "../../../../../../services/data/car.service";
import { Car } from "../../../../../../models/car.model";
import { takeUntil } from "rxjs";

@Component({
    selector: 'tank-up-box',
    standalone: true,
    templateUrl: './tank_up.component.html',
    styleUrl: './tank_up.component.scss'
})
export class TankUpBox extends NgUnsubscriber implements OnInit {
    private PS = inject(CarHomePageService)
    car = new Car()
    car_energy_state = new energySourceStatus()
    amount_tank_up = 0

    ngOnInit(): void {
        this.readCarData()
        this.calcValues()
    }

    private readCarData() {
        this.PS.car$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe( car => {
            this.car = car
        })
        this.PS.car_energy_state$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe( state => {
            this.car_energy_state = state
        })
    }

    private calcValues() {
        this.amount_tank_up = Number((this.car.engine.combustion.fuel_tank_volume - this.car_energy_state.fuel.in_stock).toFixed(1))
        this.PS.tank_up_value$.next(this.amount_tank_up)
    }
}