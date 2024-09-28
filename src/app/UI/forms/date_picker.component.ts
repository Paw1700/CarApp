import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'date-picker',
    standalone: true,
    template: `
        <div class="DATE_PICKER">
            <input type="date" [value]="value" (change)="emitNewDate($event)">
            <p>{{ title }}</p>
        </div>
    `,
    styles: `
        div.DATE_PICKER {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-evenly;

            input[type="date"] {
                width: 60%;
                height: 100%;
                font-size: 1.5rem;
                text-align: center;
            }

            p {
                width: 40%;
                font-size: 1.2rem;
                font-weight: 500;
            }
        }
    `
})
export class DatePicker {
    @Input({required: true}) title = ''
    @Input() value = ''
    @Output() valueChange = new EventEmitter<string>()

    emitNewDate(event: any) {
        this.valueChange.emit(event.target.value)
    }
}