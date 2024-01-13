import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CarType } from "../../../../../../../../models/car.model";

@Component({
    selector: 'route-type-switch',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './route_type_switch.component.html',
    styleUrl: './route_type_switch.component.scss'
})
export class RouteTypeSwitch implements OnInit {
    @Input() value: CarType | null = null
    @Output() routeTypeChanged = new EventEmitter<CarType>()
    slider_picker_pos = 2.5
    slider_value = 0

    ngOnInit(): void {
        if (!this.checkIfValueWasSetted()) {
            this.routeTypeChanged.emit('Electric')
        }
    }

    changeSliderPickerPos(e: any) {
        this.slider_value = Number(e.target.value)
        this.slider_picker_pos = this.slider_value * 0.825 + 2.5
    }

    setRouteType() {
        if (this.slider_value <= 33) {
            this.slider_value = 0
            this.slider_picker_pos = 2.5
            this.routeTypeChanged.emit('Electric')
        } else if (this.slider_value > 33 && this.slider_value <= 66) {
            this.slider_value = 50
            this.slider_picker_pos = 43.75
            this.routeTypeChanged.emit('Hybrid')
        } else {
            this.slider_value = 100
            this.slider_picker_pos = 85
            this.routeTypeChanged.emit('Combustion')
        }
    }

    private checkIfValueWasSetted(): boolean {
        if (this.value !== null) {
            switch (this.value) {
                case "Combustion":
                    this.slider_value = 100
                    this.slider_picker_pos = 85
                    break
                case "Electric":
                    this.slider_value = 0
                    this.slider_picker_pos = 2.5
                    break
                case "Hybrid":
                    this.slider_value = 50
                    this.slider_picker_pos = 43.75
                    break
            }
            return true
        } else {
            return false
        }
    }
}