import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component } from "@angular/core";

@Component({
    standalone: true,
    selector: 'upper_bar',
    templateUrl: './upper_bar.component.html',
    styleUrl: './upper_bar.component.scss',
    animations: [
        trigger('arrow', [
            state('false', style({
                opacity: 0
            })),
            state('true', style({
                opacity: 1
            })),
            transition("false <=> true", [
                animate('500ms ease-in-out')
            ])
        ]),
        trigger('main_text', [
            state('false', style({
                fontSize: '3rem',
                left: 0
            })),
            state('true', style({
                fontSize: '1.25rem',
                left: '4.15vw'
            })),
            transition("false <=> true", [
                animate('500ms ease-in-out')
            ])
        ]),
        trigger('second_text', [
            state('false', style({
                opacity: 0,
                left: '50vw'
            })),
            state('true', style({
                opacity: 1,
                left: 0
            })),
            transition("false <=> true", [
                animate('350ms ease-in-out')
            ])
        ])
    ]
})
export class UpperBar {
    main_text = 'MAIN'
    second_text = 'SECOND'
    small_mode: boolean = false

    
}