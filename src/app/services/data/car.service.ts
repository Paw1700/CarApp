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
                    return_status.fuel.in_stock = Number(car.energySourceData.combustion.avaibleAmount.toFixed(1))
                    return_status.fuel.level = Number((return_status.fuel.in_stock * 100 / fuel_tank).toFixed(0))
                    const car_avg_usage = await this.actualAvgUsage(carID, 'Combustion')
                    return_status.fuel.remain_distance = Number((return_status.fuel.in_stock / (car_avg_usage / 100)).toFixed(0))
                }
                if (car.type === 'Electric' || car.type === 'Hybrid') {
                    const battery_volume = car.engine.electric.energy_storage_volume
                    return_status.electric.in_stock = Number(car.energySourceData.electric.avaibleAmount.toFixed(1))
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
            if (new_route.usage.combustion.ratio !== 0) {
                new_route.usage.combustion.amount = await this.calcAvgUsage(carID, new_route.original_avg_fuel_usage, 'Combustion')
                return_diff_status.fuel.in_stock = Number((new_route.distance * (new_route.usage.combustion.amount / 100)).toFixed(1))
                if (new_route.usage.electric.ratio !== 0) {
                    return_diff_status.fuel.in_stock = return_diff_status.fuel.in_stock / AppEnvironment.APP_FINAL_VARIABLES.combustion_engine_hybrid_usage_ratio
                }
                const new_fuel_amount_in_stock = car_energy_source_status.fuel.in_stock - return_diff_status.fuel.in_stock
                const new_fuel_distance = Number(((new_fuel_amount_in_stock / (await this.actualAvgUsage(carID, 'Combustion', new_route.usage.combustion.amount))) * 100).toFixed(0))
                return_diff_status.fuel.remain_distance = car_energy_source_status.fuel.remain_distance - new_fuel_distance
                return_diff_status.fuel.level = Number((return_diff_status.fuel.in_stock * 100 / car.engine.combustion.fuel_tank_volume).toFixed(0))
            }
            if (new_route.usage.electric.ratio !== 0) {
                new_route.usage.electric.amount = await this.calcAvgUsage(carID, new_route.original_avg_fuel_usage, 'Electric')
                return_diff_status.electric.in_stock = Number((new_route.distance * (new_route.usage.electric.amount / 100)).toFixed(1))
                const new_energy_amount_in_stock = car_energy_source_status.electric.in_stock - return_diff_status.electric.in_stock
                const new_energy_distance = Number(((new_energy_amount_in_stock / (await this.actualAvgUsage(carID, 'Electric', new_route.usage.electric.amount))) * 100).toFixed(0))
                return_diff_status.electric.remain_distance = car_energy_source_status.electric.remain_distance - new_energy_distance
                return_diff_status.electric.level = Number((return_diff_status.electric.in_stock * 100 / car.engine.electric.energy_storage_volume).toFixed(0))
            }
            resolve(return_diff_status)
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
                const car_routes = (await this.ROUTE.getCarRoutes(carID))
                    .filter(route => type === 'Combustion' ? route.usage.combustion.ratio !== 0 : route.usage.electric.ratio !== 0)
                    .slice(0, 9)
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
     * It's tank up car by adding to avaible combustion energy source
     * @param carID id of car you want to fill up
     * @param amountToFillUp amount to fill up a car, if less than 0 it's reset amount in energy source
     */
    tankingOperation(carID: string, amountToFillUp: number): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const car = await this.getOne(carID, true) as CarDBModel
                if (amountToFillUp < 0) {
                    car.energySourceData.combustion.avaibleAmount = car.engine.combustion.fuel_tank_volume
                } else {
                    car.energySourceData.combustion.avaibleAmount += amountToFillUp
                }
                await this.saveOne(car, true)
                resolve()
            } catch (err) {
                console.error(err)
                reject(err)
            }
        })
    }

    /**
     * Function add information about chargin up electric/hybrid car to car data
     * @param carID 
     * @param chargingPower power of which car is charging, 
     * IF equal to 0 charging is stop, then modifies car data about energy state
     * IF -1 means abort charging operation and don't change energy source state
     * IF less than -1 it's charge up car instantly by changing car energy source state
     */
    chargingOperation(carID: string, chargingPower: -1 | 0 | number): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const car = await this.getOne(carID, true)
                if (car.type === 'Combustion') {
                    throw new Error('You want to charge combustion car!!!')
                }
                if (chargingPower > 0) {
                    car.energySourceData.electric.chargingStartAt = new Date()
                    car.energySourceData.electric.chargingPower = chargingPower
                }
                if (chargingPower == 0 && car.energySourceData.electric.chargingStartAt !== null && car.energySourceData.electric.chargingPower !== null) {
                    const timeTillEndOfChargingInHours = Number((((new Date().getTime() - car.energySourceData.electric.chargingStartAt.getTime()) / 1000) / 3600).toFixed(4))
                    const chargedAmount = Number((chargingPower / timeTillEndOfChargingInHours).toFixed(2))
                    if (car.engine.electric.energy_storage_volume < car.energySourceData.electric.avaibleAmount + chargedAmount) {
                        car.energySourceData.electric.avaibleAmount = car.engine.electric.energy_storage_volume
                    } else {
                        car.energySourceData.electric.avaibleAmount += chargedAmount    
                    }
                    car.energySourceData.electric.chargingPower = null
                    car.energySourceData.electric.chargingStartAt = null
                } else if (chargingPower == -1) {
                    car.energySourceData.electric.avaibleAmount = car.engine.electric.energy_storage_volume
                    car.energySourceData.electric.chargingPower = null
                    car.energySourceData.electric.chargingStartAt = null
                } else if (chargingPower < -1) {
                    car.energySourceData.electric.chargingPower = null
                    car.energySourceData.electric.chargingStartAt = null
                } else {
                    throw new Error()
                }
                this.saveOne(car, true)
                resolve()
            } catch (err) {
                console.error(err);
                reject(err)
            }
        })
    }

    /**
     * Function add route to DB and modifies car energy state and mileage
     * @param carID
     * @param newRoute 
     * @param updateMode if true it's not create new route data in DB
     * @returns 
     */
    newRouteOperation(carID: string, newRoute: Route, updateMode = false): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                // * GET CAR DATA
                const car = await this.getOne(carID, true) as CarDBModel
                // * GET FUEL CONFIG
                const fuel_config = this.DB.LS_getData(this.FC_STORE)
                if (!fuel_config) {
                    throw new Error(`Fuel Config not set!`)
                }
                // * CALC ROUTE USAGE AMOUNT DEPEND ON FUEL CONFIG
                newRoute.usage.combustion.amount = Number((newRoute.original_avg_fuel_usage * (car.engine.combustion.avg_fuel_usage / Number(fuel_config))).toFixed(1))
                newRoute.usage.electric.amount = Number((newRoute.original_avg_fuel_usage * (car.engine.electric.energy_avg_usage / Number(fuel_config))).toFixed(1))
                // * UPDATE CAR ENERGY STATE
                car.energySourceData.combustion.avaibleAmount -= newRoute.distance * ((newRoute.usage.combustion.amount * newRoute.usage.combustion.ratio) / 100)
                car.energySourceData.electric.avaibleAmount -= newRoute.distance * ((newRoute.usage.electric.amount * newRoute.usage.electric.ratio) / 100)
                // * ADD ROUTE DISTANCE TO MILEAGE OF CAR
                car.mileage.actual! += newRoute.distance
                // * ADD ROUTE TO DB
                await this.ROUTE.saveOne(newRoute, updateMode)
                // * UPDATE CAR DATA IN DB
                await this.saveOne(car, true)
                resolve()
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