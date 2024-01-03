import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'text-input',
    standalone: true,
    imports: [FormsModule, CommonModule],
    template: `
        <div [ngStyle]="{width: width_in_vw+'vw'}" class="INPUT_BOX">
            <p [class.ACTIVE]="input_active" class="INPUT_TITLE">{{ title }}</p>
            <input [(ngModel)]="value" (focus)="toogleInput(true)" (blur)="toogleInput(false); emitValue()" [class.ACTIVE]="input_active" type="text">
        </div>
    `,
    styles: `
        div.INPUT_BOX {
            // width: 89vw; SETTED BY ngStyle
            display: flex;
            flex-direction: column;
            align-items: center;

            input {
                width: 90%;
                border: .5vw solid gray;
                padding: 2vw;
                border-radius: 2.5vw;
                font-size: 1.2rem;
                font-weight: 500;
                position: relative;
                top: -3.75vw;
                transition: 0.2s ease-out;
            }

            p.INPUT_TITLE {
                font-size: 1.2rem;
                font-weight: 500;
                width: 90%;
                text-align: left;
                position: relative;
                top: 5vw;
                transition: 0.2s ease-out;
                opacity: .5;
            }

            input, p.INPUT_TITLE {
                &.ACTIVE {
                    top: 0;
                    opacity: 1;
                }
            }
        }
    `
})
export class TextInputComponent implements OnInit{
    @Input({required: true}) title = ''
    @Input() width_in_vw = 89
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