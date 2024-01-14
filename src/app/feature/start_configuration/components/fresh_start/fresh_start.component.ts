import { Component, inject } from '@angular/core';
import { CounterComponent } from '../../../../UI/counter/counter.component';
import { AppService } from '../../../../service';
import { Loader } from '../../../../UI/loaders/loader.component';

@Component({
    standalone: true,
    selector: 'fresh-start',
    templateUrl: './fresh_start.component.html',
    styleUrl: './fresh_start.component.scss',
    imports: [CounterComponent, Loader]
})
export class FreshStartComponent  {
    private APP = inject(AppService);

    avg_fuel_usage = 0;
    data_fetching = false;
    error = false;
    error_message = 'BŁĄD'
    loader_size = window.innerWidth * 0.05;

    handleCounterChange(value: number): void {
        this.avg_fuel_usage = value;
        if (this.error) {
            this.error = false;
        }
    }

    saveConfig(): void {
        this.data_fetching = true;
        setTimeout(() => {
            if (this.avg_fuel_usage > 0) {
                this.APP.firstConfigureApp(this.avg_fuel_usage);
            } else {
                this.data_fetching = false;
                this.error = true;
            }
        }, 1000)
    }
}
