import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Car, CarDBModel } from "../../../models/car.model";
import { energySourceStatus } from "../../../services/data/car.service";
import { Route } from "../../../models/route.model";
import { AppService } from "../../../service";
import { ErrorID } from "../../../models/error.model";

@Injectable()
export class CarHomePageService {
    constructor(private APP: AppService) {
        this.adaptActionBoxStateVar()
        this.adaptDiffSourceStatusToRoute()
    }
    car$ = new BehaviorSubject<Car>(new Car())
    car_energy_state$ = new BehaviorSubject<energySourceStatus>(new energySourceStatus())
    diff_energy_state$ = new BehaviorSubject<energySourceStatus>(new energySourceStatus())
    action_box_open$ = new BehaviorSubject<boolean>(false)
    action_box_state$ = new BehaviorSubject<ActionBoxState>('closed')
    route_data$ = new BehaviorSubject<Route>(new Route())
    tank_up_value$ = new BehaviorSubject<number>(0)
    charge_up_value$ = new BehaviorSubject<number>(0)
    charging_power$ = new BehaviorSubject<number | null>(null)

    updateCarStatus(carID: string): Promise<void> {
        return new Promise(async resolve => {
            await this.endChargingIfNeeded(carID)
            this.car$.next(await this.getCarData(carID))
            this.car_energy_state$.next(await this.getCarEnergyState(carID))
            resolve()
        })
    }

    saveAction() {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const carID = this.car$.value.id
                const route = this.route_data$.value
                const charging_power = this.charging_power$.value
                switch (this.action_box_state$.value) {
                    case "add_route":
                        await this.APP.DATA.CAR.newRouteOperation(carID, route)
                        break
                    case "tank_up":
                        await this.APP.DATA.CAR.tankingOperation(carID, -1)
                        break
                    case "charge_up":
                        if (charging_power !== null) {
                            await this.APP.DATA.CAR.chargingOperation(carID, charging_power)
                        }
                        break
                }
                await this.updateCarStatus(carID)
                resolve()
            } catch (err) {
                console.error(err);
                reject(err)
                this.APP.errorHappend(err as ErrorID)
            }
        })
    }

    private getCarData(carID: string): Promise<Car> {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await this.APP.DATA.CAR.getOne(carID) as Car)
            } catch (err) {
                reject()
            }
        })
    }

    private getCarEnergyState(carID: string): Promise<energySourceStatus> {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await this.APP.DATA.CAR.getCarEnergySourceStatus(carID))
            } catch (err) {
                reject()
                this.handleError(err as string)
            }
        })
    }

    private endChargingIfNeeded(carID: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const car = await this.APP.DATA.CAR.getOne(carID, true) as CarDBModel
                if (car.type !== 'Combustion' && (car.energySourceData.electric.chargingPower !== null || car.energySourceData.electric.chargingPower !== null)) {
                    if (this.isCarFullyCharged(car)) {
                        await this.APP.DATA.CAR.chargingOperation(car.id, -1)
                    }
                }
                resolve()
            } catch (err) {
                reject()
                this.handleError(err as string)
            }
        })
    }

    private adaptDiffSourceStatusToRoute() {
        this.route_data$.subscribe(async route => {
            if (this.car$.value.id !== '') {
                this.diff_energy_state$.next(await this.APP.DATA.CAR.getDiffInEnergySourceWhenAddingRoute(this.car$.value.id, JSON.parse(JSON.stringify(route))))
            }
        })
    }

    private adaptActionBoxStateVar() {
        this.action_box_open$.subscribe(bool => {
            if (!bool && this.action_box_state$.value !== 'closed') {
                this.action_box_state$.next('closed')
                this.route_data$.next(new Route())
            }
        })
        this.action_box_state$.subscribe(state => {
            if (state === 'closed' && this.action_box_open$.value) {
                this.action_box_open$.next(false)
            }
            if ((state === 'add_route' || state === 'charge_up' || state === 'tank_up') && !this.action_box_open$.value) {
                this.action_box_open$.next(true)
            }
        })
    }

    private isCarFullyCharged(car: CarDBModel): boolean {
        const energy_before_charging = car.energySourceData.electric.avaibleAmount
        const time_in_seconds_of_charging = (new Date().getTime() - car.energySourceData.electric.chargingStartAt!.getTime()) / 1000
        const power_delivered = car.energySourceData.electric.chargingPower! * (time_in_seconds_of_charging / 3600)
        if (energy_before_charging + power_delivered >= car.engine.electric.energy_storage_volume) {
            return true
        } else {
            return false
        }
    }

    private handleError(err: string | ErrorID): void {
        console.error(err)
        this.APP.errorHappend(err as ErrorID)
    }
}

export type ActionBoxState = 'closed' | 'add_route' | 'tank_up' | 'charge_up'