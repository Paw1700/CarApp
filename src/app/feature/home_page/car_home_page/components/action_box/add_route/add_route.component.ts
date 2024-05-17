import { Component, OnInit, inject } from "@angular/core";
import { RouteTypeSwitch } from "./components/route_type_switch/route_type_switch.component";
import { DatePicker } from "../../../../../../UI/forms/date_picker.component";
import { NumberInputComponent } from "../../../../../../UI/forms/number_input/number_input.component";
import { Car } from "../../../../../../models/car.model";
import { NgUnsubscriber } from "../../../../../../util/ngUnsubscriber";
import { CarHomePageService } from "../../../car_home_page.service";
import { takeUntil } from "rxjs";

@Component({
    selector: 'add-route-box',
    standalone: true,
    imports: [
        RouteTypeSwitch,
        DatePicker,
        NumberInputComponent
    ],
    templateUrl: './add_route.component.html',
    styleUrl: './add_route.component.scss'
})
export class AddRouteBox extends NgUnsubscriber implements OnInit {
    private PS = inject(CarHomePageService)
    car = new Car()
    readonly start_date = new Date().toJSON().substring(0, 10)

    ngOnInit(): void {
        this.readCarDataState()
        this.handleInput('date', new Date().toJSON().substring(0, 10))
        if (this.car.type === 'Combustion') {
            this.PS.route_data$.value.usage.combustion.ratio = 1
            this.PS.route_data$.value.usage.electric.ratio = 0
        } else if (this.car.type === 'Electric') {
            this.PS.route_data$.value.usage.combustion.ratio = 0
            this.PS.route_data$.value.usage.electric.ratio = 1
        }
    }

    handleInput(type: 'date' | 'distance' | 'avg_usage' | 'route_type_ratio', payload: any) {
        const route = this.PS.route_data$.value
        switch (type) {
            case "date":
                route.date = payload
                break
            case "distance":
                route.distance = payload
                break
            case "avg_usage":
                route.original_avg_fuel_usage = payload
                break
            case 'route_type_ratio':
                if (payload > 50) {
                    route.usage.combustion.ratio = Number(((16 + ((payload - 50) * 1.68)) / 100).toFixed(2))
                    route.usage.electric.ratio = Number(((84 - ((payload - 50) * 1.68)) / 100).toFixed(2))
                } else {
                    route.usage.combustion.ratio = Number(((payload * 0.32) / 100).toFixed(2))
                    route.usage.electric.ratio = Number(((100 - (payload * 0.32))/100).toFixed(2))
                }
                break
        }
        this.PS.route_data$.next(route)
    }

    private readCarDataState() {
        this.PS.car$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe(car => {
            this.car = car
        })
    }
}