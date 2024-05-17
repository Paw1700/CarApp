import { Component, OnInit, inject } from "@angular/core";
import { takeUntil } from "rxjs";
import { Car } from "../../../../../../models/car.model";
import { energySourceStatus } from "../../../../../../services/data/car.service";
import { CarHomePageService } from "../../../car_home_page.service";
import { NgUnsubscriber } from "../../../../../../util/ngUnsubscriber";
import { NumberInputComponent } from "../../../../../../UI/forms/number_input/number_input.component";

@Component({
    selector: 'charge-up-box',
    standalone: true,
    templateUrl: './charge_up.component.html',
    styleUrl: './charge_up.component.scss',
    imports: [
        NumberInputComponent
    ]
})
export class ChargeUpBox extends NgUnsubscriber implements OnInit{
    private PS = inject(CarHomePageService)
    car = new Car()
    car_energy_state = new energySourceStatus()
    amount_charge_up = 0
    charging_power = 0
    charging_time = ''

    ngOnInit(): void {
        this.readCarData()
        this.calcValues()
    }

    handleInput(type: 'charging_power', payload: any) {
        switch(type) {
            case 'charging_power':
                this.charging_power = payload
                this.updateChargingTime()
                break
        }
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

    private updateChargingTime() {
        if (this.charging_power > 0) {
            const time_to_charge_in_hours = Number((this.amount_charge_up / this.charging_power).toFixed(2))
            const TTCINH_hours = time_to_charge_in_hours > 1 ? Math.floor(time_to_charge_in_hours) : 0    
            const TTCINH_minutes = TTCINH_hours >= 1 ? Number(((time_to_charge_in_hours - TTCINH_hours) * 60).toFixed(0)) : Number((time_to_charge_in_hours * 60).toFixed(0))
            this.charging_time = (TTCINH_hours !== 0 ? TTCINH_hours + 'h ' : '') + (TTCINH_minutes !== 0 ? TTCINH_minutes + 'min' : '')
            console.log(`time_to_charge_in_hours: ${time_to_charge_in_hours}, TTCINH_hours: ${TTCINH_hours}, TTCINH_minutes: ${TTCINH_minutes}`);
        } else {
            this.charging_time = ''
        }
        
    }
}