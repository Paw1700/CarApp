import { Component, OnInit, inject } from "@angular/core";
import { AppService } from "../../../service";
import { CounterComponent } from "../../../UI/counter/counter.component";
import { ButtonComponent, ButtonTypes } from "../../../UI/button/button.component";
import { Loader } from "../../../UI/loaders/loader.component";

@Component({
    selector: 'fuel-config-edit',
    standalone: true,
    imports: [CounterComponent, ButtonComponent, Loader],
    templateUrl: './fuel_config_edit.component.html',
    styleUrl: './fuel_config_edit.component.scss'
})
export class FuelConfigEditComponent implements OnInit{
    private APP = inject(AppService)

    fuel_config_value: number = 0
    button_dimensions = {
        width: 86.5,
        height: 10.18,
        border_radius: 2.5
    }
    button_type: ButtonTypes = 'accent'
    data_fetching = false
    error = false
    loader_size = window.innerWidth * 0.045

    ngOnInit(): void {
        this.readFuelConfigValue()
    }

    FCValueChanged(value: number): void {
        this.fuel_config_value = value
        if (this.error) {
            this.error = false
            this.button_type = 'accent'
        }
    }

    saveFC() {
        this.data_fetching = true
        setTimeout(() => {
            this.data_fetching = false
            if (this.fuel_config_value !== 0) {
                this.APP.DATA.saveFuelConfig(this.fuel_config_value)
            } else {
                this.error = true
                this.button_type = 'error'
            }
        }, 850)
    }

    private readFuelConfigValue () {
        const value = this.APP.DATA.getFuelConfig()
        this.fuel_config_value = value === null ? 0 : value
    }
}