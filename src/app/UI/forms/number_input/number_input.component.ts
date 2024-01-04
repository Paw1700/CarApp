import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'number-input',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './number_input.component.html',
    styleUrl: './number_input.component.scss'
})
export class NumberInputComponent implements OnInit{
    @Input({required: true}) title = 'TITLE'
    @Input({required: true}) type: 'buttons' | 'typed-in' = 'buttons'
    @Input() show_fast_btns = false
    @Input() fast_btns_settings = {first_amount: 5, second_amount: 25}
    @Input() value: number | null = null
    @Input() precision = 0
    @Input() minValue: number | null = null
    @Input() maxValue: number | null = null
    @Output() valueChange = new EventEmitter<number>()
    input_active = false

    ngOnInit(): void {
        this.adjustToType()
        this.checkIfInputWasSetted()   
    }

    changeValue(operation: 'plus' | 'minus', amount?: number): void {
        let change_amount = Number((Math.pow(10, -this.precision)).toFixed(this.precision))
        if (operation === 'minus') {
            change_amount = -change_amount
        }
        let new_value = 0
        if (amount === undefined) {
            new_value = Number((this.value! + change_amount).toFixed(this.precision))
        } else {
            new_value = this.value! + amount
        }
        if (this.minValue !== null && new_value < this.minValue) {
            new_value = this.minValue
        }
        if (this.maxValue !== null && new_value > this.maxValue) {
            new_value = this.maxValue
        }
        this.emitValue(new_value)
    }

    emitValue(value?: number) {
        if (value !== undefined) {
            this.value = value
            this.valueChange.emit(value)
        } else {
            this.valueChange.emit(this.value!)
        }
    }

    toogleInput(value: boolean): void {
        if (this.value !== null && this.type === 'typed-in') {
            this.input_active = true;
        } else {
            this.input_active = value
        }
    }

    private checkIfInputWasSetted() {
        setTimeout(() => {
            this.toogleInput(false)
        }, 50)
    }

    private adjustToType() {
        if (this.type === 'buttons' && this.value === null) {
            this.value = 0
        }
    }
}