import { NgStyle } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

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
        } else {
            this.setSliderPosition(this.value)
        }
    }

    changeSliderPickerPos(e: any) {
        this.setSliderPosition(e.target.value)
        this.routeTypeRatio.emit(e.target.value)
    }

    private setSliderPosition(value: number) {
        this.slider_value = Number(value)
        this.slider_picker_pos = this.slider_value * 0.825 + 2.5
    }
}