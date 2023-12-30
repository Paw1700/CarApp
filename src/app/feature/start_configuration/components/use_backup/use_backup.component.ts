import { trigger, state, style, transition, animate } from "@angular/animations";
import { Component, OnInit, inject } from "@angular/core";
import { StartConfigViewModes, StartConfigurationPageService } from "../../start_configuration.service";
import { NgUnsubscriber } from "../../../../util/ngUnsubscriber";
import { takeUntil } from "rxjs/internal/operators/takeUntil";

@Component({
    standalone: true,
    selector: 'use-backup',
    templateUrl: './use_backup.component.html',
    styleUrl: './use_backup.component.scss',
    animations: [
        trigger('component', [
            state('backup', style({
                left: '5.5vw'
            })),
            state('*', style({
                left: '100vw',
            })),
            transition("* <=> start", [
                animate('350ms ease-in-out')
            ])
        ])
    ]
})
export class UseBackupComponent extends NgUnsubscriber implements OnInit{
    private PS = inject(StartConfigurationPageService)

    view_mode_backup: 'insert' | 'preview' = 'insert'
    view_mode: StartConfigViewModes = 'start'

    ngOnInit(): void {
        this.PS.view_mode$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe(
            mode => {
                this.view_mode = mode
            }
        )
    }
}