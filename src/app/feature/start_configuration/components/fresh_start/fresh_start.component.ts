import { Component, OnInit, inject } from '@angular/core';
import { CounterComponent } from '../../../../UI/counter/counter.component';
import {
    StartConfigViewModes,
    StartConfigurationPageService,
} from '../../start_configuration.service';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { NgUnsubscriber } from '../../../../util/ngUnsubscriber';
import { takeUntil } from 'rxjs';
import { AppService } from '../../../../service';
import { Loader } from '../../../../UI/loaders/loader.component';

@Component({
    standalone: true,
    selector: 'fresh_start',
    templateUrl: './fresh_start.component.html',
    styleUrl: './fresh_start.component.scss',
    imports: [CounterComponent, Loader],
    animations: [
        trigger('component', [
            state(
                'fresh_start',
                style({
                    left: '5.5vw',
                })
            ),
            state(
                '*',
                style({
                    left: '100vw',
                })
            ),
            transition('* <=> start', [animate('350ms ease-in-out')]),
        ]),
    ],
})
export class FreshStartComponent extends NgUnsubscriber implements OnInit {
    private PS = inject(StartConfigurationPageService);
    private APP = inject(AppService)

    avg_fuel_usage = 0;
    view_mode: StartConfigViewModes = 'start';
    data_fetching = false
    loader_size = window.innerWidth * 0.05

    handleCounterChange(value: number): void {
        this.avg_fuel_usage = value;
    }

    ngOnInit(): void {
        this.PS.view_mode$
            .pipe(takeUntil(this.ngUnsubscriber$))
            .subscribe((mode) => {
                this.view_mode = mode;
            });
    }

    saveConfig(): void {
        this.data_fetching = true
        this.APP.firstConfigureApp(this.avg_fuel_usage)
    }
}
