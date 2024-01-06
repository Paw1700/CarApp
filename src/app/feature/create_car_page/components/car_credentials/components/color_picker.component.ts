import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'color-picker',
    standalone: true,
    template: `
        <div class="COLOR_PICKER">
            <input type="color" [value]="value" (change)="emitNewColor($event)"/>
            <p>{{ title }}</p>
        </div>
    `,
    styles: `
        div.COLOR_PICKER {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            
            input[type="color"],
            input[type="date"] {
                width: 20%;
            }
            
            p {
                width: 60%;
                font-size: 1.2rem;
                font-weight: 500;
            }
        }
    `
})
export class ColorPicker {
    @Input({required: true}) title = ''
    @Input() value = ''
    @Output() valueChange = new EventEmitter<string>()

    emitNewColor(event: any) {
        this.valueChange.emit(event.target.value)
    }
}