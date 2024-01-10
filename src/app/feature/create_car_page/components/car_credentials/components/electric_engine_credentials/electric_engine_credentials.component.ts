import { Component, OnInit, inject } from "@angular/core";
import { SelectInputComponent } from "../../../../../../UI/forms/select_input/select_input.component";
import { TextInputComponent } from "../../../../../../UI/forms/text_input/text_input.component";
import { NumberInputComponent } from "../../../../../../UI/forms/number_input/number_input.component";
import { CarCreatePageService } from "../../../../create_car_page.service";
import { CarDBModel } from "../../../../../../models/car.model";
import { NgUnsubscriber } from "../../../../../../util/ngUnsubscriber";
import { takeUntil } from "rxjs";

@Component({
    selector: 'electric-engine-credentials',
    standalone: true,
    imports: [SelectInputComponent, TextInputComponent, NumberInputComponent],
    templateUrl: './electric_engine_credentials.component.html',
    styleUrl: './electric_engine_credentials.component.scss'
})
export class ElectricEngineCredentials extends NgUnsubscriber implements OnInit {
    private PS = inject(CarCreatePageService)
    readonly battery_types = [{ name: 'Bateria litowo-jonowa' }, { name: 'Wodór' }]
    car_data = new CarDBModel()

    selected_battery_type = -1

    ngOnInit(): void {
        this.readCarDataState()
    }

    handleInputChange(destination: ElectricEngineCredentialsPayloadDestinations, payload: any) {
        switch (destination) {
            case 'battery_type':
                switch (payload.name) {
                    case 'Bateria litowo-jonowa':
                        this.car_data.engine.electric.energy_storage = 'B'
                        break
                    case 'Wodór':
                        this.car_data.engine.electric.energy_storage = 'H'
                        break
                }
                break
            case "battery_volume":
                this.car_data.engine.electric.energy_storage_volume = payload
                break
            case 'avg_energy_usage':
                this.car_data.engine.electric.energy_avg_usage = payload
                break
            case "power":
                this.car_data.engine.electric.power = payload
                break
            case "torque":
                this.car_data.engine.electric.torque = payload
                break
        }
        this.PS.car_data$.next(this.car_data)
    }

    private readCarDataState() {
        this.PS.car_data$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe(data => {
            this.car_data = data
            switch (this.car_data.engine.electric.energy_storage) {
                case null:
                    this.selected_battery_type = -1
                    break
                case "H":
                    this.selected_battery_type = 2
                    break
                case "B":
                    this.selected_battery_type = 1
                    break
            }
        })
    }
}

export type ElectricEngineCredentialsPayloadDestinations = 'battery_type' | 'battery_volume' | 'avg_energy_usage' | 'power' | 'torque'