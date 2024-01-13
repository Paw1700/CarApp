import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CarDBModel, CarType } from "../../models/car.model";
import { Route } from "../../models/route.model";
import { AppService } from "../../service";

@Injectable()
export class RoutePageService {
    constructor(private APP: AppService) { }
    car_type$ = new BehaviorSubject<CarType | null>(null)
    route_to_edit$ = new BehaviorSubject<Route | null>(null)
    car_routes_list$ = new BehaviorSubject<RoutePageList[]>([])

    async saveRoute() {
        const route = this.route_to_edit$.value
        if (route) {
            if (route.usage.combustion.include) {
                route.usage.combustion.amount = await this.APP.DATA.CAR.calcAvgUsage(route.carID, route.original_avg_fuel_usage, 'Combustion')
            } else {
                route.usage.combustion.amount = 0
            }
            if (route.usage.electric.include) {
                route.usage.electric.amount = await this.APP.DATA.CAR.calcAvgUsage(route.carID, route.original_avg_fuel_usage, 'Electric')
            } else {
                route.usage.electric.amount = 0
            }
            await this.APP.DATA.ROUTE.saveOne(route, true)
            await this.getCarRoutes()
            this.route_to_edit$.next(null)
        }
    }

    async deleteRoute(route: Route) {
        await this.APP.DATA.ROUTE.delete([route.id])
        await this.getCarRoutes()
    }

    async getCarRoutes() {
        const carID = this.APP.DATA.getChoosedCarID()
        if (carID) {
            this.car_type$.next((await this.APP.DATA.CAR.getOne(carID, true) as CarDBModel).type)
            const unsorted_routes_list = await this.APP.DATA.ROUTE.getCarRoutes(carID)
            this.car_routes_list$.next(this.sortRoutesByDate(unsorted_routes_list))
        }
    }

    private sortRoutesByDate(routes: Route[]): RoutePageList[] {
        const return_list: RoutePageList[] = []
        let loop_date = new Date()
        let loop_routes: Route[] = []

        routes.forEach( (route, index, array) => {
            if (index === 0 || loop_routes.length === 0) {
                loop_date = new Date(route.date)
                loop_routes = [route]
                if (checkIfLastRoute()) {
                    endOfChapter()
                }
                return
            }

            if (!routeDateAndLoopDateAreEqual(loop_date, new Date(route.date))) {
                endOfChapter()
                loop_routes.push(route)
                loop_date = new Date(route.date)
                if (checkIfLastRoute()) {
                    endOfChapter()
                }
                return
            }

            loop_routes.push(route)
            if (checkIfLastRoute()) {
                endOfChapter()
            }

            function checkIfLastRoute(): boolean {
                return index === array.length - 1
            }

            function endOfChapter() {
                return_list.push({date: loop_date, route_list: loop_routes.reverse()})
                loop_date = new Date()
                loop_routes = []
            }

            function routeDateAndLoopDateAreEqual(loop: Date, route: Date) {
                if (
                    loop.getFullYear() > route.getFullYear() ||
                    loop.getMonth() > route.getMonth() ||
                    loop.getDate() > route.getDate()
                ) {
                    return false
                }
                return true
            }
        })

        return return_list
    }
}

export type RoutePageList = { date: Date, route_list: Route[] }