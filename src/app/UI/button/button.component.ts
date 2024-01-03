import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'btn',
    standalone: true,
    imports: [CommonModule],
    template: `
        <button
            [ngStyle]="{width: width+'vw', height: height+'vw', borderRadius: border_radius+'vw'}"
            [class.ACCENT]="btn_type === 'accent'"
            [class.ERROR]="btn_type === 'error'"
        >
            <ng-content></ng-content>
        </button>
    `,
    styles: `
        button {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            border-radius: 20%;
            background-color: var(--app-elements);
            font-size: 1rem;
            font-weight: 700;
            gap: 2.5vw;

            &.ACCENT {
                background-color: var(--accent-color);
                color: white;
                font-size: 1.5rem;
            }

            &.ERROR {
                background-color: red;
                color: white;
                font-size: 1.5rem;
            }
        }
    `,
})
export class ButtonComponent {
    @Input({ required: true, alias: 'width_in_vw' }) width: number = 0;
    @Input({ required: true, alias: 'height_in_vw' }) height: number = 0;
    @Input({alias: 'border_radius_in_vw'}) border_radius: number = 0;
    @Input() btn_type: ButtonTypes = 'normal'
}

export type ButtonTypes = 'normal' | 'accent' | 'error'
