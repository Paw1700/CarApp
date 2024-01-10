import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Loader } from "../loaders/loader.component";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
    selector: 'loading-screen',
    standalone: true,
    imports: [Loader],
    templateUrl: './loading_screen.component.html',
    styleUrl: './loading_screen.component.scss',
    animations: [
        trigger('loading_page', [
            state('false', style({
                opacity: 0
            })),
            state('true', style({
                opacity: 1
            })),
            transition("false <=> true", [
                animate('350ms ease-in')
            ])
        ])
    ]
})
export class LoadingScreen implements OnChanges{
    @Input({alias: 'loading_state_data'}) page_state: LoadingScreenInputData = {show: false, loading_stage_text: ''}
    show_layer = false
    hide_screen = true

    ngOnChanges(changes: SimpleChanges): void {
        if (this.page_state.show) {
            this.hide_screen = false
            setTimeout(() => {
                this.show_layer = true
            }, 50) 
        } else {
            this.show_layer = false
            setTimeout(() => {
                this.hide_screen = true
            }, 500)
        }
    }
}

export type LoadingScreenInputData = {
    show: boolean,
    loading_stage_text: string
}