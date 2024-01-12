import { transition } from '@angular/animations';
import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { SourceType } from "../../../../../../models/car.model";
import { sourceStatus } from "../../../../../../services/data/car.service";

@Component({
    selector: 'double-level-bar',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="DOUBLE_LEVEL_BAR">
            <div class="UPPER_BAR">
                <div class="FIRST">
                    <p class="AMOUNT_TEXT">{{ combustion_in_stock }} / {{ fuel_source_volume }} L</p>
                </div>
                <div class="SECOND">
                    <p class="AMOUNT_TEXT">{{ electric_in_stock }} / {{ energy_source_volume }} kW/h</p>
                </div>
            </div>
            <div class="BARS">
                <div class="BG"></div>
                <div class="FIRST BAR">
                    <div class="LEVEL" [ngStyle]="{'width': combustion_level_width+'%'}">
                        <img src="/assets/UI/gas_station/white.webp">
                        <p class="LEVEL_TEXT">{{ combustion_level_width }}%</p>
                    </div>
                    @if (combustion_diff_width > 0) {
                        <div [ngStyle]="{'width': combustion_diff_width+'%'}" class="DIFF">
                            <p class="LEVEL_TEXT">{{ combustion_diff_state.level }}%</p>
                        </div>
                    }
                </div>
                <div class="SECOND BAR">
                    <div class="LEVEL" [ngStyle]="{'width': electric_level_width+'%'}">
                        <img src="/assets/UI/power/white.webp">
                        <p class="LEVEL_TEXT">{{ electric_level_width }}%</p>
                    </div>
                    @if (electric_diff_width > 0) {
                        <div [ngStyle]="{'width': electric_diff_width+'%'}" class="DIFF">
                            <p class="LEVEL_TEXT">{{ electric_diff_state.level }}%</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    `,
    styles: `
    div.DOUBLE_LEVEL_BAR {
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

            div.FIRST {
                width: 60%;
            }

            div.SECOND {
                width: 40%;
            }

            div.FIRST, 
            div.SECOND {
                display: flex;
                justify-content: flex-end;

                p.AMOUNT_TEXT {
                    font-size: 1rem;
                    line-height: 1rem;
                    font-weight: 700;
                    color: white;
                    display: flex;
                    align-items: flex-end;
                }
            }

        }

        div.BARS {
            width: 100%;
            height: 1.5rem;
            border-radius: 2.5vw;
            overflow: hidden;
            display: flex;
            align-items: center;
            position: relative;
            
            div.BG {
                position: absolute;
                background-color: var(--accent-color);
                opacity: .5;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 0
            }

            div.BAR {
                height: 100%;
                position: relative;
                z-index: 1;
                display: flex;
                align-items: center;
                overflow: hidden;

                &.FIRST {
                    width: 60%;
                    
                    div.LEVEL {
                        background-color: var(--accent-color);
                    }
                }

                &.SECOND {
                    width: 40%;
                    
                    div.LEVEL {
                        background-color: var(--default-accent-color);
                    }
                }
    
                div.LEVEL,
                div.DIFF {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1.25vw;
                    transition: 0.2s ease-out;
    
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

                div.DIFF {
                    background-color: red;
                }
            }
        }

    }
    `
})
export class DoubleLevelBar implements OnChanges{
    @Input({ required: true }) combustion_bar_state: sourceStatus = { level: 0, in_stock: 0, remain_distance: 0 }
    @Input({ required: true }) electric_bar_state: sourceStatus = { level: 0, in_stock: 0, remain_distance: 0 }
    @Input({ required: true }) fuel_source_volume = 0
    @Input({ required: true }) energy_source_volume = 0
    @Input() combustion_diff_state: sourceStatus = {level: 0, in_stock: 0, remain_distance: 0}
    @Input() electric_diff_state: sourceStatus = {level: 0, in_stock: 0, remain_distance: 0}

    combustion_in_stock = 0
    electric_in_stock = 0
    combustion_level_width = 0
    electric_level_width = 0 
    combustion_diff_width = 0
    electric_diff_width = 0

    ngOnChanges(changes: SimpleChanges): void {
        this.combustion_in_stock = Number((this.combustion_bar_state.in_stock - this.combustion_diff_state.in_stock).toFixed(1))
        this.electric_in_stock = Number((this.electric_bar_state.in_stock - this.electric_diff_state.in_stock).toFixed(1))
        this.combustion_level_width = Number((this.combustion_bar_state.level - this.combustion_diff_state.level).toFixed(0))
        this.electric_level_width = Number((this.electric_bar_state.level - this.electric_diff_state.level).toFixed(0))
        this.combustion_diff_width = this.combustion_diff_state.level
        this.electric_diff_width = this.electric_diff_state.level
    }
}