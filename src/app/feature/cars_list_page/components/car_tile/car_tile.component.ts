import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Car } from "../../../../models/car.model";
import { CommonModule } from "@angular/common";
import { energySourceStatus } from "../../../../services/data/car.service";

@Component({
    selector: 'car-tile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './car_tile.component.html',
    styleUrl: './car_tile.component.scss'
})
export class CarTile {
    @Input({required: true}) car: Car = new Car()
    @Input({required: true}) car_energy_source_state = new energySourceStatus()
    @Input({required: true}) car_is_selected = false
    @Output() car_is_choosed = new EventEmitter<string>()
    private readonly tile_posistions = {default: 0, energy_state: 46}
    tile_posistion = 0

    emitClick() {
        this.car_is_choosed.emit(this.car.id)
        this.car_is_selected = !this.car_is_selected
    }

    toogleEnergyStatusView() {
        if (this.tile_posistion === this.tile_posistions.default) {
            this.tile_posistion = this.tile_posistions.energy_state
        } else {
            this.tile_posistion = this.tile_posistions.default
        }
    }
}