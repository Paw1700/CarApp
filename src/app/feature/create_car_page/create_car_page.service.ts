import { Injectable, inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CarDBModel } from "../../models/car.model";
import { AppService } from "../../service";

@Injectable()
export class CarCreatePageService {
    private APP = inject(AppService)
    car_data$ = new BehaviorSubject<CarDBModel>(new CarDBModel())
    edit_mode$ = new BehaviorSubject<boolean>(false)

    saveCar(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.APP.DATA.CAR.saveOne(this.car_data$.value, this.edit_mode$.value)
                resolve()
            } catch (err) {
                // !!! SEND ERROR TO APP SERVICES
                reject(err)
            }
        })
    }
}