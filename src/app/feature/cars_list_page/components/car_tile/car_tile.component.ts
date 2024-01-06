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
    private start_touch_position = {x: 0, y: 0}
    private end_touch_position = {x: 0, y: 0}
    private diff_X_limit = 30
    private diff_Y_limit = 30
    private readonly tile_posistions = {default: 0, energy_state: 46}
    tile_posistion = 0

    emitClick() {
        this.car_is_choosed.emit(this.car.id)
        this.car_is_selected = !this.car_is_selected
    }

    scrollEvent(e: TouchEvent) {
        if (e.changedTouches[0].force) {
            this.start_touch_position.x = e.changedTouches[0].clientX
            this.start_touch_position.y = e.changedTouches[0].clientY
        } else {
            this.end_touch_position.x = e.changedTouches[0].clientX
            this.end_touch_position.y = e.changedTouches[0].clientY
        }
        const diff_X = this.start_touch_position.x - this.end_touch_position.x
        const diff_Y = this.start_touch_position.y - this.end_touch_position.y
        if (Math.abs(diff_X) <= this.diff_X_limit && Math.abs(diff_Y) >= this.diff_Y_limit) {
            if (diff_Y <= 0) { // SCROLL DOWN
                console.log('SCROLL DOWN');
                this.tile_posistion = this.tile_posistions.default
            } else { //SCROLL UP
                console.log('SCROLL UP');
                this.tile_posistion = this.tile_posistions.energy_state
            }
        } 
    }
}