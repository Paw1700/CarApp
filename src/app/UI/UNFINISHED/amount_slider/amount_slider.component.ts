import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: 'amount-slider',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './amount_slider.component.html',
    styleUrl: "./amount_slider.component.scss"
})
export class AmountSlider implements OnInit{
    @Input() minValue = 0
    @Input() maxValue = 100
    @Input() precision = 0
    @Output() valueChange = new EventEmitter<number>()
    slider_picker_pos = 2.5
    slider_step = 1
    slider_value = 0

    ngOnInit(): void {
        this.slider_step = Number((Math.pow(10, -this.precision)).toFixed(this.precision))
    }

    changeSliderPickerPos(e: any) {
        this.slider_value = Number(e.target.value)
        this.slider_picker_pos = (this.slider_value * 100 / this.maxValue) * 0.825 + 2.5
    }
}