import { NgStyle } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CarType } from "../../../../../../../../models/car.model";

@Component({
    selector: 'route-type-switch',
    standalone: true,
    imports: [NgStyle],
    templateUrl: './route_type_switch.component.html',
    styleUrl: './route_type_switch.component.scss'
})
export class RouteTypeSwitch implements OnInit {
    @Input() value: number | null = null
    @Output() routeTypeRatio = new EventEmitter<number>()
    slider_picker_pos = 2.5
    slider_value = 0

    ngOnInit(): void {
        if (this.value === null) {
            this.routeTypeRatio.emit(0)
        }
    }

    changeSliderPickerPos(e: any) {
        this.slider_value = Number(e.target.value)
        this.slider_picker_pos = this.slider_value * 0.825 + 2.5
        this.routeTypeRatio.emit(this.slider_value)
    }
}