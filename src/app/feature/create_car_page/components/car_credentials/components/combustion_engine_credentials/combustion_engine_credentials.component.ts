import { Component, OnInit, inject } from "@angular/core";
import { NumberInputComponent } from "../../../../../../UI/forms/number_input/number_input.component";
import { TextInputComponent } from "../../../../../../UI/forms/text_input/text_input.component";
import { SelectInputComponent } from "../../../../../../UI/forms/select_input/select_input.component";
import { CarCreatePageService } from "../../../../create_car_page.service";
import { NgUnsubscriber } from "../../../../../../util/ngUnsubscriber";
import { CarDBModel } from "../../../../../../models/car.model";
import { takeUntil } from "rxjs";

@Component({
    selector: 'combustion-engine-credentials',
    standalone: true,
    imports: [NumberInputComponent, TextInputComponent, SelectInputComponent],
    templateUrl: './combustion_engine_credentials.component.html',
    styleUrl: './combustion_engine_credentials.component.scss'
})
export class CombustionEngineCredentials extends NgUnsubscriber implements OnInit {
    private PS = inject(CarCreatePageService)
    readonly combustion_engine_types = [{ name: 'Widlasty' }, { name: 'Rzędowy' }, { name: 'Boxer' }]
    readonly fuel_type = [{ name: 'Benzyna' }, { name: 'Diesel' }]

    car_data = new CarDBModel()
    engine_type_selected_index = -1
    fuel_type_selected_index = -1

    ngOnInit(): void {
        this.readCarDataState()
    }

    handleInputChange(destination: CombustionEngineCredentialsInputDestinations, payload: any) {
        switch (destination) {
            case 'engine_volume':
                this.car_data.engine.combustion.volume = payload
                break
            case 'engine_type':
                switch (payload.name) {
                    case 'Widlasty':
                        this.car_data.engine.combustion.piston_design = 'V'
                        break
                    case 'Rzędowy':
                        this.car_data.engine.combustion.piston_design = 'R'
                        break
                    case 'Boxer':
                        this.car_data.engine.combustion.piston_design = 'B'
                        break
                }
                break
            case "pistion_amount":
                this.car_data.engine.combustion.piston_amount = payload
                break
            case 'fuel_type':
                switch(payload.name) {
                    case 'Benzyna':
                        this.car_data.engine.combustion.fuel_type = 'B'
                        break
                    case 'Diesel':
                        this.car_data.engine.combustion.fuel_type = 'D'
                        break
                }
                break
            case 'fuel_tank_volume':
                this.car_data.engine.combustion.fuel_tank_volume = payload
                break
            case "avg_fuel_usage":
                this.car_data.engine.combustion.avg_fuel_usage = payload
                break
            case "power":
                this.car_data.engine.combustion.power = payload
                break
            case "torque":
                this.car_data.engine.combustion.torque = payload
                break
        }
        this.PS.car_data$.next(this.car_data)
    }

    private readCarDataState() {
        this.PS.car_data$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe(data => {
            this.car_data = data
            switch (this.car_data.engine.combustion.piston_design) {
                case null:
                    this.engine_type_selected_index = -1
                    break
                case "R":
                    this.engine_type_selected_index = 1
                    break
                case "V":
                    this.engine_type_selected_index = 0
                    break
                case "B":
                    this.engine_type_selected_index = 2
                    break
            }
            switch (this.car_data.engine.combustion.fuel_type) {
                case null:
                    this.fuel_type_selected_index = -1
                    break
                case "B":
                    this.fuel_type_selected_index = 0
                    break
                case "D":
                    this.fuel_type_selected_index = 1
                    break
            }
        })
    }
}

export type CombustionEngineCredentialsInputDestinations = 'engine_volume' | 'engine_type' | 'pistion_amount' | 'fuel_type' | 'fuel_tank_volume' | 'avg_fuel_usage' | 'power' | 'torque'