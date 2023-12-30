import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, Input, OnInit, inject } from "@angular/core";
import { AppLocations } from "../../data/types";
import { AppService } from "../../service";

@Component({
    standalone: true,
    selector: 'upper_bar',
    templateUrl: './upper_bar.component.html',
    styleUrl: './upper_bar.component.scss',
    animations: [
        trigger('upper_bar', [
            state('hidden', style({
                zIndex: -1,
                opacity: 0
            }))
        ]),
        trigger('arrow', [
            state('big', style({
                opacity: 0
            })),
            state('small', style({
                opacity: 1
            })),
            transition("small <=> big", [
                animate('500ms ease-in-out')
            ])
        ]),
        trigger('main_text', [
            state('big', style({
                fontSize: '3rem',
                left: 0
            })),
            state('small', style({
                fontSize: '1.25rem',
                left: '4.15vw'
            })),
            transition("small <=> big", [
                animate('500ms ease-in-out')
            ])
        ]),
        trigger('second_text', [
            state('big', style({
                opacity: 0,
                left: '50vw'
            })),
            state('small', style({
                opacity: 1,
                left: 0
            })),
            transition("small <=> big", [
                animate('350ms ease-in-out')
            ])
        ])
    ]
})
export class UpperBar implements OnInit{
    @Input() detachedMode: boolean = false

    private APP = inject(AppService)

    @Input() main_text = 'MAIN'
    @Input() second_text = 'SECOND'
    @Input() bar_mode: UpperBarModes = "hidden"
    return_location: AppLocations | null = null

    ngOnInit(): void {
        if (!this.detachedMode) {
            this.APP.APPERANCE.upper_bar_state$.subscribe(
                state => {
                    this.main_text = state.main_title
                    this.second_text = state.seconde_title
                    this.bar_mode = state.bar_mode
                    this.return_location = state.return_location
                }
            )
        }
        
    }

    navigate(): void {
        if (this.return_location !== null) {
            //!!! NAVIGATE AWAY
        }
    }
}

export type UpperBarModes = 'small' | 'big' | 'hidden'

export class UpperBarState {
    constructor(
        public main_title = '',
        public seconde_title = '',
        public bar_mode: UpperBarModes = 'hidden',
        public return_location: AppLocations | null = null
    ) { }
}