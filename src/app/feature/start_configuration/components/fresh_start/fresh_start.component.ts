import { Component } from "@angular/core";
import { CounterComponent } from "../../../../shared/components/counter/counter.component";

@Component({
    standalone: true,
    selector: 'fresh_start',
    templateUrl: './fresh_start.component.html',
    styleUrl: './fresh_start.component.scss',
    imports: [CounterComponent]
})
export class FreshStartComponent {
    avg_fuel_usage = 0

    handleCounterChange(value: number): void {
        console.log(value);
        this.avg_fuel_usage = value
        
    }
}