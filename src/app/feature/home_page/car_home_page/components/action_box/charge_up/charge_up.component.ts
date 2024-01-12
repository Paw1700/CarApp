import { Component, OnInit, inject } from "@angular/core";
import { takeUntil } from "rxjs";
import { Car } from "../../../../../../models/car.model";
import { energySourceStatus } from "../../../../../../services/data/car.service";
import { CarHomePageService } from "../../../car_home_page.service";
import { NgUnsubscriber } from "../../../../../../util/ngUnsubscriber";

@Component({
    selector: 'charge-up-box',
    standalone: true,
    templateUrl: './charge_up.component.html',
    styleUrl: './charge_up.component.scss'
})
export class ChargeUpBox extends NgUnsubscriber implements OnInit{
    private PS = inject(CarHomePageService)
    car = new Car()
    car_energy_state = new energySourceStatus()
    amount_charge_up = 0

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
        this.amount_charge_up = Number((this.car.engine.electric.energy_storage_volume - this.car_energy_state.electric.in_stock).toFixed(1))
        this.PS.charge_up_value$.next(this.amount_charge_up)
    }
}