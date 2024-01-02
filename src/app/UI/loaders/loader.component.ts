import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'loader',
    standalone: true,
    imports: [CommonModule],
    template: `<div
        class="SPINNER"
        [class.WHITE]="white_border"
        [ngStyle]="{
            width: size + 'px',
            height: size + 'px',
            margin: margin + 'px',
            borderWidth: size * 0.32 + 'px'
        }"
    ></div>`,
    styles: [
        `
            div.SPINNER {
                border-width: 8px;
                border-style: solid;
                border-color: var(--accent-color) transparent transparent
                    transparent;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                position: relative;
                margin: 25px 25px;

                &.WHITE {
                    border-color: white transparent transparent transparent;
                }

                &:before,
                &:after {
                    content: '';
                    width: 32%;
                    height: 32%;
                    border-radius: 50%;
                    background: var(--accent-color);
                    position: absolute;
                    left: -16%;
                }
                
                &.WHITE:before,
                &.WHITE:after {
                    background: white;
                }

                &:before {
                    top: -8%;
                }

                &:after {
                    bottom: 80%;
                    left: 80%;
                }
            }

            @keyframes spin {
                100% {
                    transform: rotate(360deg);
                }
            }
        `,
    ],
})
export class Loader {
    @Input() size: number = 25;
    margin = this.size * 0.125
    @Input() white_border: boolean = false;
}
