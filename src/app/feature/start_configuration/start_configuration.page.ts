import { Component, OnInit, inject } from "@angular/core";
import { ChooseOptionComponent } from "./components/choose_option/choose_option.component";
import { FreshStartComponent } from "./components/fresh_start/fresh_start.component";
import { animate, style, transition, trigger } from "@angular/animations";
import { TitleBar } from "../../UI/title_bar/title_bar.component";
import { ImportBackupComponent } from "../import_backup/import_backup.component";

@Component({
    standalone: true,
    selector: 'start_configuration',
    templateUrl: './start_configuration.page.html',
    styleUrl: './start_configuration.page.scss',
    imports: [
        ChooseOptionComponent, 
        FreshStartComponent, 
        TitleBar,
        ImportBackupComponent
    ],
    animations: [
        trigger('welcome_text', [
            transition('void => *', [
                style({top: '-10vh' }),
                animate('350ms ease-out', style({
                    top: '2.5vh'
                }))
            ]),
            transition('* => void', [
                animate('350ms ease-out', style({
                    top: '-10vh'
                }))
            ]),
        ]),
        trigger('choose_option', [
            transition('void => *', [
                style({left: '-100vw'}),
                animate('350ms 150ms ease-out', style({
                    left: '5.5vw'
                }))
            ]),
            transition('* => void', [
                animate('350ms ease-out', style({
                    left: '-100vw'
                }))
            ]),
        ]),
        trigger('option', [
            transition('void => *', [
                style({
                    position: 'relative',
                    left: '100vw'
                }),
                animate('350ms ease-out', style({
                    left: 0
                }))
            ]),
            transition('* => void', [
                style({position: 'relative', left: 0}),
                animate('350ms ease-in', style({
                    left: '100vw'
                }))
            ])
        ])
    ]
})
export class StartConfiguration {
    view_mode: StartConfigViewModes = 'start'

    handleViewChange(view: StartConfigViewModes) {
        this.view_mode = view
    }
}

export type StartConfigViewModes = 'start' | 'backup' | 'fresh_start'