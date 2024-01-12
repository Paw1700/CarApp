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
export class AddRouteBox extends NgUnsubscriber implements OnInit{
    private PS = inject(CarHomePageService)
    car = new Car()
    readonly start_date = new Date().toJSON().substring(0, 10)

    ngOnInit(): void {
        this.readCarDataState()
        this.handleInput('date', new Date().toJSON().substring(0, 10))
        if (this.car.type === 'Combustion') {
            this.PS.route_data$.value.usage.combustion.include = true
        } else if (this.car.type === 'Electric') {
            this.PS.route_data$.value.usage.electric.include = true
        }
    }

    handleInput(type: 'date' | 'distance' | 'avg_usage' | 'route_type', payload: any) {
        const route = this.PS.route_data$.value
        switch(type) {
            case "date":
                route.date = payload
                break
            case "distance":
                route.distance = payload
                break
            case "avg_usage":
                route.original_avg_fuel_usage = payload
                break
            case 'route_type':
                switch(payload) {
                    case 'Combustion':
                        route.usage.combustion.include = true
                        route.usage.electric.include = false
                        break
                    case 'Electric':
                        route.usage.combustion.include = false
                        route.usage.electric.include = true
                        break
                    case 'Hybrid':
                        route.usage.combustion.include = true
                        route.usage.electric.include = true
                        break
                }
                break
        }
        this.PS.route_data$.next(route)
    }

    private readCarDataState() {
        this.PS.car$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe( car => {
            this.car = car
        })
    }
}