import { Injectable, inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CarDBModel } from "../../models/car.model";
import { AppService } from "../../service";

@Injectable()
export class CarCreatePageService {
    private APP = inject(AppService)
    car_data$ = new BehaviorSubject<CarDBModel>(new CarDBModel())

    saveCar(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.APP.DATA.CAR.saveOne(this.car_data$.value)
                resolve()
            } catch (err) {
                // !!! SEND ERROR TO APP SERVICES
                reject()
            }
        })
    }
}