import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { energySourceStatus } from "../../../../services/data/car.service";
import { CarType } from "../../../../models/car.model";

@Component({
    selector: 'remain-distance',
    standalone: true,
    template: `
    <div class="COMPONENT">
        <p class="TITLE">Pozostały dystans</p>
        <div class="DISTANCE">
            <p class="ACTUAL">{{ main_distance }} km</p>
            @if (diff_main_distance !== 0) {
                <div class="DIFF">
                    <img [src]="diff_main_distance <= 0 ? '/assets/UI/green_up_arrow/arrow.webp' : '/assets/UI/red_down_arrow/arrow.webp'">
                    <p [class.RED]="diff_main_distance > 0" [class.GREEN]="diff_main_distance <= 0">{{ diff_main_distance_to_show }}</p>
                </div>
            }
        </div>
        @if (car_type === 'Hybrid') {
            <div class="ELECTRIC_DISTANCE"> 
                <img src="/assets/UI/power/white.webp">
                <p>{{ second_distance }} km</p>
                @if (diff_second_distance !== 0) {
                    <img class="ARROW" [src]="diff_second_distance <= 0 ? '/assets/UI/green_up_arrow/arrow.webp' : '/assets/UI/red_down_arrow/arrow.webp'" >
                    <p [class.RED]="diff_second_distance > 0" [class.GREEN]="diff_second_distance <= 0">{{ diff_second_distance_to_show }}</p>
                }
            </div>
        }
    </div>
    `,
    styles: `
    div.COMPONENT {
        width: 100%;
        height: 100%;
        color: white;

        p {
            width: 100%;
            text-align: left;
        }

        div.DISTANCE {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 1.25vw;

            p.ACTUAL {
                width: auto;
                font-size: 2.25rem;
                font-weight: 700;
            }

            div.DIFF {
                display: flex;
                align-items: center;
                gap: 1.25vw;

                img {
                    height: 1rem;
                    object-fit: contain;
                }

                p {
                    font-size: 1.5rem;
                    width: auto;

                    &.RED {
                        color: red;
                    }

                    &.GREEN {
                        color: green;
                    }
                }
            }
        }

        p.TITLE {
            font-size: 1.5rem;
            font-weight: 600;
        }
        

        div.ELECTRIC_DISTANCE {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 1.25vw;
            font-weight: 500;

            img {
                height: 1rem;
                object-fit: contain;

                &.ARROW {
                    height: .65rem;
                }
            }

            p {
                width: auto;

                &.RED {
                    color: red;
                }

                &.GREEN {
                    color: green;
                }
            }
        }
     }
    `
})
export class RemainDistanceText implements OnChanges {
    @Input({ required: true }) energy_state = new energySourceStatus()
    @Input({ required: true }) car_type: CarType | null = null
    @Input() diff_energy_state = new energySourceStatus()
    main_distance = 0
    diff_main_distance = 0
    diff_main_distance_to_show = 0
    second_distance = 0
    diff_second_distance_to_show = 0
    diff_second_distance = 0

    ngOnChanges(changes: SimpleChanges): void {
        if (this.car_type === 'Hybrid') {
            this.second_distance = this.energy_state.electric.remain_distance - this.diff_energy_state.electric.remain_distance
            this.diff_second_distance_to_show = Math.abs(this.diff_energy_state.electric.remain_distance)
            this.diff_second_distance = this.diff_energy_state.electric.remain_distance
        }
        this.main_distance = ((this.car_type === 'Combustion' || this.car_type === 'Hybrid') ? this.energy_state.fuel.remain_distance : this.energy_state.electric.remain_distance) - ((this.car_type === 'Combustion' || this.car_type === 'Hybrid') ? this.diff_energy_state.fuel.remain_distance : this.diff_energy_state.electric.remain_distance)
        this.diff_main_distance = (this.car_type === 'Combustion' || this.car_type === 'Hybrid') ? this.diff_energy_state.fuel.remain_distance : this.diff_energy_state.electric.remain_distance
        this.diff_main_distance_to_show = Math.abs(this.diff_main_distance)
    }
}