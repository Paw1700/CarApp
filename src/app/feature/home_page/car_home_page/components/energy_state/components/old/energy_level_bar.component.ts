import { Component, Input, OnInit } from "@angular/core";
import { sourceStatus } from "../../../../../../../services/data/car.service";
import { CommonModule } from "@angular/common";
import { SourceType } from "../../../../../../../models/car.model";

@Component({
    selector: 'energy-level-bar',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="COMPONENT">
            <div class="UPPER_BAR">
                <p class="TITLE">Stan {{ source_type === 'Combustion' ? 'paliwa' : 'energii'}}</p>
                <p class="LEVEL_TEXT">{{ bar_state.in_stock }} / {{ energy_source_volume }} {{ source_type === 'Combustion' ? 'L' : 'kW/h'}}</p>
            </div>
            <div class="BAR"><div class="LEVEL" [ngStyle]="{'width': bar_state.level+'%'}">{{ bar_state.level }}%</div></div>
        </div>
    `,
    styles: `
    div.COMPONENT {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        div.UPPER_BAR {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            p.TITLE, p.LEVEL_TEXT {
                font-size: 1rem;
                font-weight: 500;
                color: white;
            }
        }


        div.BAR {
            background-color: var(--app-elements);
            width: 100%;
            height: 1.5rem;
            border-radius: 2.5vw;
            overflow: hidden;

            div.LEVEL {
                height: 100%;
                background-color: var(--accent-color);
                display: flex;
                aling-items: center;
                justify-content: center;
                font-size: 1.25rem;
                font-weight: 600;
                color: white;
            }
        }
    }
    `
})
export class EnergyLevelBar {
    @Input({required: true}) source_type: SourceType = 'Combustion'
    @Input({required: true}) bar_state: sourceStatus = { level: 0, in_stock: 0, remain_distance: 0 }
    @Input({required: true}) energy_source_volume = 0 
}