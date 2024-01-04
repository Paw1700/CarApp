import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'text-input',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './text_input.component.html',
    styleUrl: './text_input.component.scss'
})
export class TextInputComponent implements OnInit{
    @Input({required: true}) title = ''
    @Input() value = ''
    @Output() valueChange = new EventEmitter<string>()
    input_active = false

    ngOnInit(): void {
        this.checkIfInputWasSetted()   
    }

    toogleInput(value: boolean): void {
        if (this.value !== '') {
            this.input_active = true;
        } else {
            this.input_active = value
        }
    }

    emitValue() {
        this.valueChange.emit(this.value)
    }

    private checkIfInputWasSetted() {
        setTimeout(() => {
            this.toogleInput(false)
        }, 50)
    }
}