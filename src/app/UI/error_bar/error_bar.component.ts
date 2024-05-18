import { Component, inject, OnInit } from "@angular/core";
import { ErrorModel } from "../../models/error.model";
import { AppService } from "../../service";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
    selector: 'error-bar',
    standalone: true,
    templateUrl: './error_bar.component.html',
    styleUrl: './error_bar.component.scss',
    animations: [
        trigger('bar', [
            transition('void => *', [
                style({top: '-10vh'}),
                animate('200ms ease-out', style({
                    top: '2.5vh'
                }))
            ]),
            transition('* => void', [
                style({top: '2.5vh'}),
                animate('200ms ease-in', style({
                    top: '-10vh'
                }))
            ])
        ])
    ]
})
export class ErrorBarComponent implements OnInit {
    readonly APP = inject(AppService)
    errorObject: ErrorModel | null = null

    ngOnInit(): void {
        this.APP.active_error$.subscribe( error => {
            this.errorObject = error
        })
    }
}