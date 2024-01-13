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
    route_type: CarType | null = null

    ngOnInit(): void {
        this.PS.car_type$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe( type => {
            this.car_type = type
        })
        this.PS.route_to_edit$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe( route => {
            this.route_to_edit = route
            if (this.car_type === 'Hybrid') {
                if (route?.usage.combustion.include && route?.usage.electric.include) {
                    this.route_type = 'Hybrid'
                } else if (!route?.usage.combustion.include && route?.usage.electric.include) {
                    this.route_type = 'Electric'
                } else if (route?.usage.combustion.include && !route?.usage.electric.include) {
                    this.route_type = 'Combustion'
                }
            }
        })
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
            this.PS.route_to_edit$.next(route)
        }
    }

    saveEdit() {
        this.PS.saveRoute()
    }
}