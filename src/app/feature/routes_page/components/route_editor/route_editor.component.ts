import { Component, OnInit, inject } from "@angular/core";
import { RouteTypeSwitch } from "../../../home_page/car_home_page/components/action_box/add_route/components/route_type_switch/route_type_switch.component";
import { RoutePageService } from "../../routes_page.service";
import { NgUnsubscriber } from "../../../../util/ngUnsubscriber";
import { Route } from "../../../../models/route.model";
import { takeUntil } from "rxjs";
import { CarType } from "../../../../models/car.model";
import { DatePicker } from "../../../../UI/forms/date_picker.component";
import { NumberInputComponent } from "../../../../UI/forms/number_input/number_input.component";

@Component({
    selector: 'route-editor',
    standalone: true,
    imports: [
        RouteTypeSwitch,
        DatePicker,
        NumberInputComponent
    ],
    templateUrl: './route_editor.component.html',
    styleUrl: './route_editor.component.scss'
})
export class RouteEditor extends NgUnsubscriber implements OnInit{
    private PS = inject(RoutePageService)
    route_to_edit: Route | null = null
    car_type: CarType | null = null
    route_type_ratio: number | null = null
    affectCar = false

    ngOnInit(): void {
        this.PS.car_type$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe( type => {
            this.car_type = type
        })
        this.PS.route_to_edit$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe( route => {
            this.route_to_edit = route
            if (this.car_type === 'Hybrid') {
                const ratio = route?.usage.combustion.ratio!
                if (ratio > 0.16) {
                    this.route_type_ratio = Number(((((ratio - 0.16) / 1.68) + 0.5) * 100).toFixed(0))
                } else {
                    this.route_type_ratio = Number(((ratio / 0.32) * 100).toFixed(0))
                }
            }
        })
    }

    affectionOfCarState(e: any) {
        this.affectCar = e.target.checked
    }

    cancelEdit() {
        this.PS.route_to_edit$.next(null)
    }

    handleInput(type: 'date' | 'distance' | 'avg_usage' | 'route_type', payload: any) {
        const route = this.route_to_edit
        if (route) {
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
                    if (payload > 50) {
                        route.usage.combustion.ratio = Number(((16 + ((payload - 50) * 1.68)) / 100).toFixed(2))
                        route.usage.electric.ratio = Number(((84 - ((payload - 50) * 1.68)) / 100).toFixed(2))
                    } else {
                        route.usage.combustion.ratio = Number(((payload * 0.32) / 100).toFixed(2))
                        route.usage.electric.ratio = Number(((100 - (payload * 0.32))/100).toFixed(2))
                    }
                    break
            }
            this.PS.route_to_edit$.next(route)
        }
    }

    saveEdit() {
        this.PS.saveRoute(this.affectCar)
    }
}