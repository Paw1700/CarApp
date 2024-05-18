import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CarDBModel, CarType } from "../../models/car.model";
import { Route } from "../../models/route.model";
import { AppService } from "../../service";
import { ErrorID } from "../../models/error.model";

@Injectable()
export class RoutePageService {
    constructor(private APP: AppService) { }
    car_type$ = new BehaviorSubject<CarType | null>(null)
    route_to_edit$ = new BehaviorSubject<Route | null>(null)
    route_to_delete$ = new BehaviorSubject<Route | null>(null)
    car_routes_list$ = new BehaviorSubject<RoutePageList>({ list: [], isMore: false })

    async saveRoute(affectCar = false) {
        const route = this.route_to_edit$.value
        if (route) {
            try {
                await this.APP.DATA.CAR.newRouteOperation(route.carID, route, true, affectCar)
                await this.getCarRoutes()
                this.route_to_edit$.next(null)
            } catch (err) {
                this.APP.errorHappend(err as ErrorID)
                console.error(err);
            }
        }
    }

    async deleteRoute(route: Route, affectCarSourceStatus = false) {
        try {
            if (affectCarSourceStatus) {
                await this.APP.DATA.CAR.removeRouteOperation(route, true)
            } else {
                await this.APP.DATA.ROUTE.delete([route.id])
            }
            await this.getCarRoutes()
            this.route_to_delete$.next(null)
        } catch (err) {
            this.APP.errorHappend(err as ErrorID)
            console.error(err)
        }
    }

    async getCarRoutes(page?: number) {
        const carID = this.APP.DATA.getChoosedCarID()
        if (carID) {
            this.car_type$.next((await this.APP.DATA.CAR.getOne(carID, true) as CarDBModel).type)
            let unsorted_routes_list = await this.APP.DATA.ROUTE.getCarRoutes(carID), isMoreRoutes = false
            if (page) {
                const unsorted_routes_list_length = unsorted_routes_list.length
                if (page * 12 < unsorted_routes_list_length) {
                    isMoreRoutes = true
                }
                unsorted_routes_list = unsorted_routes_list.slice(0, page * 12)
            }
            this.car_routes_list$.next({ list: this.sortRoutesByDate(unsorted_routes_list), isMore: isMoreRoutes })
        }
    }

    private sortRoutesByDate(routes: Route[]): RoutePageListItem[] {
        const return_list: RoutePageListItem[] = []
        let loop_date = new Date()
        let loop_routes: Route[] = []

        routes.forEach((route, index, array) => {
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
                return_list.push({ date: loop_date, route_list: loop_routes.reverse() })
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

export type RoutePageList = { list: RoutePageListItem[], isMore: boolean }
export type RoutePageListItem = { date: Date, route_list: Route[] }