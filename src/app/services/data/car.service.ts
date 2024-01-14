import { Injectable } from "@angular/core";
import { DatabaseManager } from "../../util/db.driver";
import { AppValidator } from "../validator.service";
import { Car, CarDBModel, SourceType } from "../../models/car.model";
import { DB_STORES, LS_STORES } from "./_main.service";
import { CarBrand } from "../../models/car_brand.model";
import { RouteService } from "./routes.service";
import { AppEnvironment } from "../../environment";
import { Route } from "../../models/route.model";

@Injectable()
export class CarService {
    constructor(private DB: DatabaseManager, private ROUTE: RouteService, private VALIDATOR: AppValidator) { }

    private readonly DB_STORES = new DB_STORES()
    private readonly FC_STORE = new LS_STORES().fuelConfigAvgUsage

    /**
     * @returns data of car from DB
     * @param carID id of car you want receive
     * @param dbVersion if true functio will return CarDBModel, otherwise it will be CarModel
     */
    getOne(carID: string, dbVersion: boolean = false): Promise<Car | CarDBModel> {
        return new Promise(async (resolve, reject) => {
            try {
                if (dbVersion) {
                    resolve(await this.DB.getObject<CarDBModel>(this.DB_STORES.cars, carID))
                } else {
                    const car_from_DB = await this.DB.getObject<CarDBModel>(this.DB_STORES.cars, carID)
                    resolve(await this.convertCarDBModelToCarModel(car_from_DB))
                }
            } catch {
                reject("CAR-GET-ERROR")
            }
        })
    }

    /**
     * @returns all cars from DB
     * @param dbVersion change data model type, if true will return CarDBModel[], otherwise Car[]
     */
    getAll(dbVersion = false): Promise<Car[] | CarDBModel[]> {
        return new Promise(async (resolve, reject) => {
            try {
                if (dbVersion) {
                    resolve(await this.DB.getAllObject<CarDBModel>(this.DB_STORES.cars))
                } else {
                    const cars_from_DB = await this.DB.getAllObject<CarDBModel>(this.DB_STORES.cars)
                    const cars: Car[] = []
                    for (let i = 0; i <= cars_from_DB.length - 1; i++) {
                        cars.push(await this.convertCarDBModelToCarModel(cars_from_DB[i]))
                    }
                    resolve(cars)
                }
            } catch {
                reject("CAR-GET-ERROR")
            }
        })
    }

    /**
     * @param car data you want to save
     * @param updateMode if true will update data of exist car in DB !!! it deletes all routes of car if type was changed !!!
     * @returns 
     */
    saveOne(car: CarDBModel, updateMode = false, backup_mode = false): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!updateMode) {
                    car.id = await this.DB.GENERATE_INDEX(this.DB_STORES.cars)
                } else if (!backup_mode) {
                    //* CHECK IF CAR TYPE WAS CHANGE, IF SO DELETE ALL IT'S ROADS
                    const old_car = await this.getOne(car.id, true) as CarDBModel
                    if (car.type !== old_car.type) {
                        await this.deleteCarRotues(car.id)
                    }
                }
                const validationResult = await this.VALIDATOR.validateCar(car)
                if (validationResult.pass) {
                    await this.DB.insertObject<CarDBModel>(this.DB_STORES.cars, car)
                    resolve()
                } else {
                    if (!updateMode) {
                        await this.DB.RELEASE_INDEX(this.DB_STORES.cars, car.id)
                    }
                    console.error(validationResult.reason)
                    reject(validationResult.errCode)
                }
            } catch {
                reject('CAR-SAVE-ERROR')
            }
        })
    }

    /**
     * Deletes car (and routes assiocated with it) from DB 
     * @param carID id of car you want delete
     */
    deleteOne(carID: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.deleteCarRotues(carID)
                await this.DB.RELEASE_INDEX(this.DB_STORES.cars, carID)
                await this.DB.deleteObject(this.DB_STORES.cars, carID)
                resolve()
            } catch {
                reject("CAR-DELETE-ERROR")
            }
        })
    }

    /**
     * @returns status of car including data about it's source level and reaming distance to travel in km
     * @param carID id of car you want status
     */
    getCarEnergySourceStatus(carID: string): Promise<energySourceStatus> {
        return new Promise(async (resolve, reject) => {
            try {
                const car = await this.getOne(carID, true) as CarDBModel
                const return_status = new energySourceStatus()
                if (car.type === 'Combustion' || car.type === 'Hybrid') {
                    const fuel_tank = car.engine.combustion.fuel_tank_volume
                    const used_fuel = await this.usedSource(carID, 'Combustion')
                    return_status.fuel.in_stock = Number((fuel_tank - used_fuel).toFixed(1))
                    return_status.fuel.level = Number((return_status.fuel.in_stock * 100 / fuel_tank).toFixed(0))
                    const car_avg_usage = await this.actualAvgUsage(carID, 'Combustion')
                    return_status.fuel.remain_distance = Number((return_status.fuel.in_stock / (car_avg_usage / 100)).toFixed(0))
                }
                if (car.type === 'Electric' || car.type === 'Hybrid') {
                    const battery_volume = car.engine.electric.energy_storage_volume
                    const used_energy = await this.usedSource(carID, 'Electric')
                    return_status.electric.in_stock = Number((battery_volume - used_energy).toFixed(1))
                    return_status.electric.level = Number((return_status.electric.in_stock * 100 / battery_volume).toFixed(0))
                    const car_avg_usage = await this.actualAvgUsage(carID, 'Electric')
                    return_status.electric.remain_distance = Number((return_status.electric.in_stock / (car_avg_usage / 100)).toFixed(0))
                }
                resolve(return_status)
            } catch (err) {
                console.error(err);
                reject()
            }
        })
    }

    getDiffInEnergySourceWhenAddingRoute(carID: string, new_route: Route): Promise<energySourceStatus> {
        return new Promise<energySourceStatus>(async (resolve, reject) => {
            const car = await this.getOne(carID, true) as CarDBModel
            const car_energy_source_status = await this.getCarEnergySourceStatus(carID)
            const return_diff_status = new energySourceStatus()
            if (new_route.usage.combustion.include) {
                // return_diff_status.fuel.in_stock
                new_route.usage.combustion.amount = await this.calcAvgUsage(carID, new_route.original_avg_fuel_usage, 'Combustion')
                return_diff_status.fuel.in_stock = Number((new_route.distance * (new_route.usage.combustion.amount / 100)).toFixed(1))
                if (new_route.usage.electric.include) {
                    return_diff_status.fuel.in_stock = return_diff_status.fuel.in_stock / AppEnvironment.APP_FINAL_VARIABLES.combustion_engine_hybrid_usage_ratio
                }
                // return_diff_status.fuel.remain_distance
                const new_fuel_amount_in_stock = car_energy_source_status.fuel.in_stock - return_diff_status.fuel.in_stock
                const new_fuel_distance = Number(((new_fuel_amount_in_stock / (await this.actualAvgUsage(carID, 'Combustion', new_route.usage.combustion.amount))) * 100).toFixed(0))
                return_diff_status.fuel.remain_distance = car_energy_source_status.fuel.remain_distance - new_fuel_distance
                // return_diff_status.fuel.level
                return_diff_status.fuel.level = Number((return_diff_status.fuel.in_stock * 100 / car.engine.combustion.fuel_tank_volume).toFixed(0))
            }
            if (new_route.usage.electric.include) {
                // return_diff_status.electric.in_stock
                new_route.usage.electric.amount = await this.calcAvgUsage(carID, new_route.original_avg_fuel_usage, 'Electric')
                return_diff_status.electric.in_stock = Number((new_route.distance * (new_route.usage.electric.amount / 100)).toFixed(1))
                // return_diff_status.electric.remain_distance
                const new_energy_amount_in_stock = car_energy_source_status.electric.in_stock - return_diff_status.electric.in_stock
                const new_energy_distance = Number(((new_energy_amount_in_stock / (await this.actualAvgUsage(carID, 'Electric', new_route.usage.electric.amount))) * 100).toFixed(0))
                return_diff_status.electric.remain_distance = car_energy_source_status.electric.remain_distance - new_energy_distance
                // return_diff_status.electric.level
                return_diff_status.electric.level = Number((return_diff_status.electric.in_stock * 100 / car.engine.electric.energy_storage_volume).toFixed(0))
            }
            resolve(return_diff_status)
        })
    }

    /**
     * @returns distance driven by car in routes saved in DB
     * @param carID id of car you want data
     */
    distanceDriven(carID: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            try {
                const car_routes = await this.ROUTE.getCarRoutes(carID)
                let distance_sum = 0
                car_routes.forEach(route => {
                    distance_sum += route.distance
                })
                resolve(distance_sum)
            } catch (err) {
                console.error(err)
                reject()
            }
        })
    }

    /**
     * Calculates actual average energy/fuel usage in 100km, by adding new route average usage you get new average usage including added route
     * @param carID id of car
     * @param type of source 
     * @param new_route_avg_usage new route's average fuel/energy usage
     * @returns actual average usage of car
     */
    actualAvgUsage(carID: string, type: SourceType, new_route_avg_usage?: number): Promise<number> {
        return new Promise(async (resolve, reject) => {
            try {
                //!! CAN CAUSE PROBLEM 
                const car_routes = (await this.ROUTE.getCarRoutes(carID)).filter(route => type === 'Combustion' ? route.usage.combustion.include : route.usage.electric.include)
                const car = await this.getOne(carID, true) as CarDBModel
                const car_manufacture_avg_usage = type === 'Combustion' ? car.engine.combustion.avg_fuel_usage : car.engine.electric.energy_avg_usage
                if (car_routes.length === 0) {
                    resolve(Number(((car_manufacture_avg_usage + (new_route_avg_usage ? new_route_avg_usage : 0)) / (new_route_avg_usage ? 2 : 1)).toFixed(1)))
                } else {
                    let sum_of_source_avg = 0
                    car_routes.forEach(
                        route => {
                            sum_of_source_avg += type === 'Combustion' ? route.usage.combustion.amount : route.usage.electric.amount
                        }
                    )
                    sum_of_source_avg += new_route_avg_usage ? new_route_avg_usage : 0
                    sum_of_source_avg += car_manufacture_avg_usage
                    resolve(sum_of_source_avg / ((car_routes.length + 1) + (new_route_avg_usage ? 1 : 0)))
                }
            } catch (err) {
                console.error(err);
                reject()
            }
        })
    }

    /**
     * @param carID id of car you want to calculated average usage
     * @param real_avg_usage real value of average fuel usage of your own car
     * @param type of source
     * @returns average usage of sourve multiplate by ratio (manufatucred) car average to your own car 
     */
    calcAvgUsage(carID: string, real_avg_usage: number, type: SourceType): Promise<number> {
        return new Promise(
            async (resolve, reject) => {
                const fuel_config = this.DB.LS_getData(this.FC_STORE)
                if (fuel_config === '' || fuel_config === '0' || fuel_config === null) {
                    reject(`Fuel Config not set!`)
                    return;
                }
                let calculatedAvgUsage = 0
                const car = await this.getOne(carID, true) as CarDBModel
                calculatedAvgUsage = real_avg_usage * ((type === 'Combustion' ? car.engine.combustion.avg_fuel_usage : car.engine.electric.energy_avg_usage) / Number(fuel_config))
                resolve(calculatedAvgUsage)
            }
        )
    }

    /**
     * It's tank up car by deleting combustion route or converting hybrid routes in to electric one
     * @param carID id of car you want to fill up
     */
    tankUp(carID: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const car_routes = await this.ROUTE.getCarRoutes(carID)
                if (car_routes.length > 0) {
                    let sumOfKm = 0
                    const save_changed_routes: Route[] = []
                    const routesIDs_to_delete: string[] = []
                    car_routes.forEach(route => {
                        const loop_route = route
                        let delete_this_one = false
                        if (loop_route.usage.combustion.include && loop_route.usage.electric.include) {
                            loop_route.usage.combustion.include = false
                        } else if (loop_route.usage.combustion.include && !loop_route.usage.electric.include) {
                            delete_this_one = true
                        }
                        if (delete_this_one) {
                            sumOfKm += loop_route.distance
                            routesIDs_to_delete.push(loop_route.id)
                        } else {
                            save_changed_routes.push(loop_route)
                        }
                    })
                    const car = await this.getOne(carID, true) as CarDBModel
                    car.mileage.actual = Number((Number(car.mileage.actual) + sumOfKm).toFixed(0))
                    await this.saveOne(car, true)
                    await this.ROUTE.delete(routesIDs_to_delete)
                    for (let i = 0; i <= save_changed_routes.length - 1; i++) {
                        await this.ROUTE.saveOne(save_changed_routes[i], true)
                    }
                    resolve()
                } else {
                    //!!! CREATE ERROR CODE
                    throw new Error('Empty routes')
                }
            } catch (err) {
                console.error(err)
                reject(err)
            }
        })
    }

    /**
     * It's charge up car by deleting electric route or converting hybrid routes in to combustion one
     * @param carID 
     */
    chargeUp(carID: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const car_routes = await this.ROUTE.getCarRoutes(carID)
                if (car_routes.length > 0) {
                    let sumOfKm = 0
                    const save_changed_routes: Route[] = []
                    const routesIDs_to_delete: string[] = []
                    car_routes.forEach(route => {
                        const loop_route = route
                        let delete_this_one = false
                        if (loop_route.usage.combustion.include && loop_route.usage.electric.include) {
                            loop_route.usage.electric.include = false
                        } else if (loop_route.usage.electric.include && !loop_route.usage.combustion.include) {
                            delete_this_one = true
                        }
                        if (delete_this_one) {
                            sumOfKm += loop_route.distance
                            routesIDs_to_delete.push(loop_route.id)
                        } else {
                            save_changed_routes.push(loop_route)
                        }
                    })
                    const car = await this.getOne(carID, true) as CarDBModel
                    car.mileage.actual = Number((Number(car.mileage.actual) + sumOfKm).toFixed(0))
                    await this.saveOne(car, true)
                    await this.ROUTE.delete(routesIDs_to_delete)
                    for (let i = 0; i <= save_changed_routes.length - 1; i++) {
                        await this.ROUTE.saveOne(save_changed_routes[i], true)
                    }
                    resolve()
                } else {
                    //!!! CREATE ERROR CODE
                    throw new Error('Empty routes')
                }
            } catch (err) {
                console.error(err);
                reject(err)
            }
        })
    }

    /**
     * @returns sum of fuel/energy used by car
     * @param carID id of car
     * @param type of source
     * @param CCRCUTH (Convert Combustion Routes Combustion Usage To Hybrid) if hybrid route was changed to combustion, amount of it is still divided by constant of hybrid route which sometimes needs to be converted back
     */
    private usedSource(carID: string, type: SourceType, CCRCUTH = true): Promise<number> {
        return new Promise(async (resolve, reject) => {
            try {
                const car_routes = await this.ROUTE.getCarRoutes(carID)
                let sum_of_source = 0
                car_routes.forEach(route => {
                    switch (type) {
                        case "Combustion":
                            if (route.usage.combustion.include) {
                                let route_usage = route.usage.combustion.amount
                                if (CCRCUTH && route.usage.electric.amount !== 0) {
                                    route_usage /= AppEnvironment.APP_FINAL_VARIABLES.combustion_engine_hybrid_usage_ratio
                                }
                                sum_of_source += Number((route.distance * (route_usage / 100)).toFixed(1))
                            }
                            break
                        case "Electric":
                            if (route.usage.electric.include) {
                                sum_of_source += Number((route.distance * (route.usage.electric.amount / 100)).toFixed(1))
                            }
                            break
                    }
                })
                resolve(sum_of_source)
            } catch (err) {
                console.error(err)
                reject()
            }
        })
    }

    /**
     * Deletes all routes of car in DB 
     * @param carID id of car 
     */
    private deleteCarRotues(carID: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const car_routes_ids = (await this.ROUTE.getCarRoutes(carID)).map(route => route.id)
                await this.ROUTE.delete(car_routes_ids)
                resolve()
            } catch (err) {
                reject(err)
            }
        })
    }

    /**
     * @param car_DB_model CarDBModel based data of car
     * @returns CarModel based data of car
     */
    private convertCarDBModelToCarModel(car_DB_model: CarDBModel): Promise<Car> {
        return new Promise(async (resolve, reject) => {
            try {
                const brand = await this.DB.getObject<CarBrand>(this.DB_STORES.carBrands, car_DB_model.brandId)
                resolve(new Car(car_DB_model, brand))
                // resolve(new Car(car_DB_model.id, brand, car_DB_model.model, car_DB_model.mileage, car_DB_model.type, car_DB_model.engine, car_DB_model.gearbox, car_DB_model.drive_type, car_DB_model.insurance, car_DB_model.tech_review_ends, car_DB_model.color, car_DB_model.photo))
            } catch (err) {
                reject(err)
            }
        })
    }
}

export class energySourceStatus {
    constructor(
        public fuel: sourceStatus = {
            level: 0,
            in_stock: 0,
            remain_distance: 0
        },
        public electric: sourceStatus = {
            level: 0,
            in_stock: 0,
            remain_distance: 0
        }
    ) { }
}

export type sourceStatus = {
    level: number,
    in_stock: number,
    remain_distance: number
} 