import { Component, OnInit, inject } from "@angular/core";
import { StartConfigViewModes, StartConfigurationPageService } from "../../start_configuration.service";
import { NgUnsubscriber } from "../../../../util/ngUnsubscriber";
import { takeUntil } from "rxjs";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
    standalone: true,
    selector: 'choose_option',
    templateUrl: './choose_option.component.html',
    styleUrl: './choose_option.component.scss',
    animations: [
        trigger('component', [
            state('start', style({
                left: '5.5vw'
            })),
            state('*', style({
                left: '-100vw'
            })),
            transition("* <=> start", [
                animate('350ms ease-in-out')
            ])
        ])
    ]
})
export class ChooseOptionComponent extends NgUnsubscriber implements OnInit{
    private PageService = inject(StartConfigurationPageService)
    view_mode: StartConfigViewModes = 'start'

    ngOnInit(): void {
        this.PageService.view_mode$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe(
            mode => {
                this.view_mode = mode
            }
        )
    }

    chooseOption(option: 'fresh_start' | 'backup') {
        this.PageService.view_mode$.next(option)
    }
}