import { Injectable } from "@angular/core";
import { DatabaseManager } from "../../util/db.driver";
import { AppValidator } from "../validator.service";
import { Route } from "../../models/route.model";
import { DB_STORES } from "./_main.service";

@Injectable()
export class RouteService {
    constructor (private DB: DatabaseManager, private VALIDATOR: AppValidator) { }
    private readonly DB_STORE = new DB_STORES().routes

    /**
     * @returns all routes of car
     * @param carID id of car
     */
    getCarRoutes(carID: string): Promise<Route[]> {
        return new Promise(async (resolve, reject) => {
            try {
                resolve((await this.DB.getAllObject<Route>(this.DB_STORE)).filter(route => route.carID === carID).sort(
                    (a, b) => {
                        if (a.date < b.date) {
                            return 1
                        }
                        if (a.date > b.date) {
                            return -1
                        }
                        return 0
                    }
                ))
            } catch  {
                reject("ROUTE-GET-ERROR")
            }
        })
    }

    /**
     * @returns all rotues in DB
     */
    getAll(): Promise<Route[]> {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await this.DB.getAllObject<Route>(this.DB_STORE))
            } catch {
                reject("ROUTE-GET-ERROR")
            }
        })
    }

    /**
     * Saves route in (before it, it will be validated) DB
     * @param route data
     * @param updateMode if true it will update exist route in DB, otherwise create new route in DB 
     */
    saveOne(route: Route, updateMode = false): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!updateMode) {
                route.id = await this.DB.GENERATE_INDEX(this.DB_STORE)
            }
            const validation_result = this.VALIDATOR.validateRoute(route)
            if (validation_result.pass) {
                try {
                    await this.DB.insertObject(this.DB_STORE, route)
                    resolve()
                } catch {
                    reject("DB-SAVE-ERROR")
                }
            } else {
                if (!updateMode) {
                    await this.DB.RELEASE_INDEX(this.DB_STORE, route.id)
                }
                reject(validation_result.errCode)
                console.warn(validation_result.reason);
            }
        })
    }

    /**
     * Deletes routes from DB, if deletion failed it will return ids of that undeleted routes in array
     * @param routesIDs ids of routes you want to delete
     */
    //!!! FUNCTION WAS MODIFIDIED CAN DON'T WORK 
    delete(routesIDs: string[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let ids_unable_to_delete: string[] = []
            for (let i = 0; i <= routesIDs.length -1; i++) {
                try {
                    await this.DB.RELEASE_INDEX(this.DB_STORE, routesIDs[i])
                    await this.DB.deleteObject(this.DB_STORE, routesIDs[i])
                } catch {
                    ids_unable_to_delete.push(routesIDs[i])
                }
            }
            if (ids_unable_to_delete.length <= 0) {
                resolve()
            } else {
                reject(ids_unable_to_delete)
            }
        })
    }


}