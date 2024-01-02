import { Component, EventEmitter, Output, inject } from '@angular/core';
import { AppService } from '../../service';

@Component({
    selector: 'not-choosed-car',
    standalone: true,
    template: `
        <div class="CNT">
            <p>Nie wybrano auta</p>
            <p (click)="redirectToCarList.emit()">przejdź do listy aut</p>
        </div>
    `,
    styles: `
        p {
            text-align: center;

            &:first-of-type {
                font-size: 2rem;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                letter-spacing: -0.32px;
            }

            &:last-of-type {
                color: #00A410;
                font-size: 1.25rem;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                letter-spacing: -0.32px;
            }
        }

        div.CNT {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content:center;
            width: 100vw;
            height: 90vh;
        }
    `,
})
export class NotChoosedCarComponent {
    @Output() redirectToCarList = new EventEmitter<void>();
}
