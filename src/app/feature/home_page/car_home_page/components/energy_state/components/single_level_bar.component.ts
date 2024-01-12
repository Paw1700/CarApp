import { transition } from '@angular/animations';
import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { SourceType } from "../../../../../../models/car.model";
import { sourceStatus } from "../../../../../../services/data/car.service";

@Component({
    selector: 'single-level-bar',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="SINGLE_LEVEL_BAR">
            <div class="UPPER_BAR">
                @if (diff_bar_state.in_stock > 0) {
                    <div class="DIFF">
                        <img src="/assets/UI/red_down_arrow/arrow.webp">
                        <p>{{ diff_bar_state.in_stock }}</p>
                    </div>
                }
                <p class="AMOUNT_TEXT">{{ in_stock }} {{ source_type === 'Combustion' ? 'L' : 'kW/h'}} / {{ energy_source_volume }}</p>
            </div>
            <div class="BAR">
                <div class="BG"></div>
                <div class="LEVEL" [ngStyle]="{'width': bar_width+'%'}">
                    <img [src]="source_type === 'Combustion' ? '/assets/UI/gas_station/white.webp' : '/assets/UI/power/white.webp'">
                    <p class="LEVEL_TEXT">{{ bar_state.level }}%</p>
                </div>
                @if (diff_width > 0) {
                    <div [ngStyle]="{'width': diff_width+'%'}" class="DIFF_LEVEL"><p class="LEVEL_TEXT">{{ diff_bar_state.level }}</p></div>
                }
            </div>
        </div>
    `,
    styles: `
    div.SINGLE_LEVEL_BAR {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.25vw;

        div.UPPER_BAR {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 2.5vw;

            div.DIFF {
                display: flex;
                align-items: center;
                gap: 1.25vw;

                img {
                    height: .65rem;
                    object-fit: contain;
                }

                p {
                    font-size: 1rem;
                    line-height: 1rem;
                    font-weight: 700;
                    color: red;
                }
            }

            
            p.AMOUNT_TEXT {
                font-size: 1rem;
                line-height: 1rem;
                font-weight: 700;
                color: white;
                display: flex;
                align-items: flex-end;
            }
        }


        div.BAR {
            width: 100%;
            height: 1.5rem;
            border-radius: 2.5vw;
            overflow: hidden;
            display: flex;
            align-items: center;
            position: relative;

            div.BG {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                background-color: var(--accent-color);
                opacity: .5;
                z-index: 0;
            }

            div.LEVEL,
            div.DIFF_LEVEL {
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 2.5vw;
                position: relative;
                z-index: 1;
                transition: all 0.2s ease;
                overflow: hidden;

                p.LEVEL_TEXT {
                    font-size: 1rem;
                    line-height: 1rem;
                    font-weight: 700;
                    color: white;
                }

                img {
                    height: 75%;
                    object-fit: contain;
                }
            }

            div.LEVEL {
                background-color: var(--accent-color);
            }

            div.DIFF_LEVEL {
                background-color: red;
            }
        }
    }
    `
})
export class SingleLevelBar implements OnChanges {
    @Input({ required: true }) source_type: SourceType = 'Combustion'
    @Input({ required: true }) bar_state: sourceStatus = { level: 0, in_stock: 0, remain_distance: 0 }
    @Input({ required: true }) energy_source_volume = 0
    @Input() diff_bar_state: sourceStatus = { level: 0, in_stock: 0, remain_distance: 0 }
    bar_width = 0
    diff_width = 0
    in_stock = 0

    ngOnChanges(changes: SimpleChanges): void {
        this.bar_width = Number((this.bar_state.level - this.diff_bar_state.level).toFixed(1))
        this.in_stock = Number((this.bar_state.in_stock - this.diff_bar_state.in_stock).toFixed(1))
        this.diff_width = this.diff_bar_state.level
    }
}