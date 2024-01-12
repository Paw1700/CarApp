import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Car } from "../../../../../models/car.model";
import { energySourceStatus } from "../../../../../services/data/car.service";
import { SingleLevelBar } from "./components/single_level_bar.component";
import { DoubleLevelBar } from "./components/double_level_bar.component";

@Component({
    selector: 'energy-state',
    standalone: true,
    imports: [SingleLevelBar, DoubleLevelBar],
    templateUrl: './energy_state.component.html',
    styleUrl: './energy_state.component.scss'
})
export class EnergyState {
    @Input({required: true}) car_energy_state = new energySourceStatus()
    @Input({required: true}) car = new Car()
    @Input() diff_energy_state = new energySourceStatus()
}