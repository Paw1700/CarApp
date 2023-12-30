import { Component, OnInit, inject } from "@angular/core";
import { CounterComponent } from "../../../../shared/components/counter/counter.component";
import { StartConfigViewModes, StartConfigurationPageService } from "../../start_configuration.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { NgUnsubscriber } from "../../../../util/ngUnsubscriber";
import { takeUntil } from "rxjs";

@Component({
    standalone: true,
    selector: 'fresh_start',
    templateUrl: './fresh_start.component.html',
    styleUrl: './fresh_start.component.scss',
    imports: [CounterComponent],
    animations: [
        trigger('component', [
            state('fresh_start', style({
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
export class FreshStartComponent extends NgUnsubscriber implements OnInit{
    private PS = inject(StartConfigurationPageService)

    avg_fuel_usage = 0
    view_mode: StartConfigViewModes = 'start'

    handleCounterChange(value: number): void {
        this.avg_fuel_usage = value
    }

    ngOnInit(): void {
        this.PS.view_mode$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe(
            mode => {
                this.view_mode = mode
            }
        )
    }
}