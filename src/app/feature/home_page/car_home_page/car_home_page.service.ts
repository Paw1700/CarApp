import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Car } from "../../../models/car.model";
import { energySourceStatus } from "../../../services/data/car.service";
import { Route } from "../../../models/route.model";
import { AppService } from "../../../service";

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

    getCarData(carID: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const car = await this.APP.DATA.CAR.getOne(carID) as Car
                const car_energy_state = await this.APP.DATA.CAR.getCarEnergySourceStatus(carID)
                this.car$.next(car)
                this.car_energy_state$.next(car_energy_state)
                resolve()
            } catch (err) {
                console.error(err);
                reject(err)
            }
        })
    }

    saveAction() {
        return new Promise<void>(async (resolve, reject) => {
            try {
                switch (this.action_box_state$.value) {
                    case "add_route":
                        const route = this.route_data$.value
                        route.carID = this.car$.value.id
                        if (route.usage.combustion.include) {
                            route.usage.combustion.amount = await this.APP.DATA.CAR.calcAvgUsage(route.carID, route.original_avg_fuel_usage, 'Combustion')
                        }
                        if (route.usage.electric.include) {
                            route.usage.electric.amount = await this.APP.DATA.CAR.calcAvgUsage(route.carID, route.original_avg_fuel_usage, 'Electric')
                        }
                        await this.APP.DATA.ROUTE.saveOne(route)
                        const car = await this.APP.DATA.CAR.getOne(this.car$.value.id, true)
                        car.mileage.actual = Number(car.mileage.actual) + route.distance
                        await this.APP.DATA.CAR.saveOne(car, true)
                        break
                    case "tank_up":
                        await this.APP.DATA.CAR.tankingOperation(this.car$.value.id, -1)
                        break
                    case "charge_up":
                        await this.APP.DATA.CAR.chargingOperation(this.car$.value.id, -1)
                        break
                }
                await this.getCarData(this.car$.value.id)
                resolve()
            } catch (err) {
                console.error(err);
                reject(err)
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
}

export type ActionBoxState = 'closed' | 'add_route' | 'tank_up' | 'charge_up'