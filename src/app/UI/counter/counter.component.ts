import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    standalone: true,
    selector: 'counter',
    templateUrl: './counter.component.html',
    styleUrl: './counter.component.scss'
})
export class CounterComponent {
    @Input() value: number = 0
    @Input() title: string = 'TEMPLATE'
    @Input() minValue: number | null = null
    @Input() maxValue: number | null = null
    @Output() changedValue = new EventEmitter<number>()

    addValue(amount: number): void {
        let new_value = this.value + amount
        if (this.minValue !== null && new_value < this.minValue) {
            new_value = this.minValue
        }
        if (this.maxValue !== null && new_value > this.maxValue) {
            new_value = this.maxValue
        }
        this.changedValue.emit(new_value)
    }
}