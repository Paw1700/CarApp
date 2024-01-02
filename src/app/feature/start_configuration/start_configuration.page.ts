import { Component, OnInit, inject } from "@angular/core";
import { ChooseOptionComponent } from "./components/choose_option/choose_option.component";
import { StartConfigViewModes, StartConfigurationPageService } from "./start_configuration.service";
import { FreshStartComponent } from "./components/fresh_start/fresh_start.component";
import { UseBackupComponent } from "./components/use_backup/use_backup.component";
import { NgUnsubscriber } from "../../util/ngUnsubscriber";
import { takeUntil } from "rxjs";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { TitleBar } from "../../UI/title_bar/title_bar.component";

@Component({
    standalone: true,
    selector: 'start_configuration',
    templateUrl: './start_configuration.page.html',
    styleUrl: './start_configuration.page.scss',
    imports: [ChooseOptionComponent, FreshStartComponent, UseBackupComponent, TitleBar],
    providers: [StartConfigurationPageService],
    animations: [
        trigger('welcome_text', [
            state('start', style({
                opacity: 1
            })),
            state('*', style({
                opacity: 0
            })),
            transition('* <=> start', [
                animate('350ms ease-in-out')
            ])
        ])
    ]
})
export class StartConfiguration extends NgUnsubscriber implements OnInit {
    private PS = inject(StartConfigurationPageService)
    view_mode: StartConfigViewModes = 'start'

    ngOnInit(): void {
        this.PS.view_mode$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe(
            mode => {
                this.view_mode = mode
            }
        )
    }

    returnToStart() {
        this.PS.view_mode$.next('start')
    }
}