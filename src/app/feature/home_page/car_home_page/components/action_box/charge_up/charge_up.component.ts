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
    left_charging_time = ''

    ngOnInit(): void {
        this.readCarData()
        this.calcValues()
    }

    handleInput(type: 'charging_power' | 'stop_charging' | 'full_charge', payload: any) {
        switch(type) {
            case 'charging_power':
                this.charging_power = payload
                this.updateChargingTime()
                this.PS.charging_power$.next(payload)
                break
            case 'stop_charging':
                this.charging_power = 0
                this.updateChargingTime()
                this.PS.charging_power$.next(0)
                this.PS.saveAction()
                .then(() => {
                    this.PS.action_box_state$.next('closed')
                })
                break
            case 'full_charge':
                this.charging_power = 0
                this.updateChargingTime()
                this.PS.charging_power$.next(-1)
                this.PS.saveAction()
                .then(() => {
                    this.PS.action_box_state$.next('closed')
                })
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
        if (this.car.energySourceData.electric.chargingPower !== null && this.car.energySourceData.electric.chargingStartAt !== null) {
            this.updateLeftChargingTime()
        }
    }

    private updateChargingTime() {
        if (this.charging_power > 0) {
            const time_to_charge_in_hours = Number((this.amount_charge_up / this.charging_power).toFixed(2))
            const set_of_time = this.convertHoursToSetOfTime(time_to_charge_in_hours)
            this.charging_time = (set_of_time.hours !== 0 ? set_of_time.hours + 'h ' : '') + (set_of_time.minutes !== 0 ? set_of_time.minutes + 'min' : '')
        } else {
            this.charging_time = ''
        }
    }

    private updateLeftChargingTime() {
        if (this.car.energySourceData.electric.chargingPower !== null && this.car.energySourceData.electric.chargingStartAt !== null) {
            const charge_time_till_now_in_seconds = (new Date().getTime() - this.car.energySourceData.electric.chargingStartAt.getTime()) / 1000
            const power_delivered_till_now = this.car.energySourceData.electric.chargingPower * (charge_time_till_now_in_seconds / 3600)
            const car_battery_before_charging = this.car.energySourceData.electric.avaibleAmount
            const power_left_to_charge = (this.car.engine.electric.energy_storage_volume - car_battery_before_charging) - power_delivered_till_now
            const time_to_full_charge_in_hours = Number((power_left_to_charge / this.car.energySourceData.electric.chargingPower).toFixed(2))
            const set_of_time = this.convertHoursToSetOfTime(time_to_full_charge_in_hours)
            this.left_charging_time = (set_of_time.hours !== 0 ? set_of_time.hours + 'h' : '') + (set_of_time.minutes !== 0 ? set_of_time.minutes + 'min' : '')
        } else {
            this.left_charging_time = ''
        }
    }

    private convertHoursToSetOfTime(time_in_hours: number): {hours: number, minutes: number} {
        const hours = time_in_hours > 1 ? Math.floor(time_in_hours) : 0
        const minutes = hours >= 1 ? Number(((time_in_hours - hours) * 60).toFixed(0)) : Number((time_in_hours * 60).toFixed(0))
        return {
            hours: hours,
            minutes: minutes
        }
    }
}