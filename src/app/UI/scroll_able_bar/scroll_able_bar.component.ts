import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: 'scroll-able-bar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './scroll_able_bar.component.html',
    styleUrl: './scroll_able_bar.component.scss'
})
export class ScrollAbleBar implements OnInit {
    @Input({ required: true }) first_option = new ScrollBarOption('', 25, null, null)
    @Input({ required: true }) second_option = new ScrollBarOption('', 25, null, null)
    @Input() first_option_return_value: any = null
    @Input() second_option_return_value: any = null
    @Output() first_option_pressed = new EventEmitter<any>()
    @Output() second_option_pressed = new EventEmitter<any>()
    private start_touch_position = { x: 0, y: 0 }
    private end_touch_posistion = { x: 0, y: 0 }
    private bar_defualt_position = 0//-this.first_option.width_in_percent
    private bar_first_posistion = 0
    private bar_second_position = 0 //-(this.first_option.width_in_percent + this.second_option.width_in_percent)
    private readonly diffYLimit = 30
    bar_posistion = this.bar_defualt_position

    ngOnInit(): void {
        this.bar_defualt_position = -this.first_option.width_in_percent
        this.bar_second_position = -(this.first_option.width_in_percent + this.second_option.width_in_percent)
        this.bar_posistion = this.bar_defualt_position
    }

    handleTouchEvent(e: TouchEvent, type: 'start' | 'during' | 'end') {
        switch (type) {
            case "start":
                this.start_touch_position.x = e.changedTouches[0].clientX
                this.start_touch_position.y = e.changedTouches[0].clientY
                break
            case "end":
                this.end_touch_posistion.x = e.changedTouches[0].clientX
                this.end_touch_posistion.y = e.changedTouches[0].clientY
                if (Math.abs(this.start_touch_position.y - this.end_touch_posistion.y) < this.diffYLimit) {
                    if (this.start_touch_position.x - this.end_touch_posistion.x > 50) { // SWIPE RIGHT
                        if (this.bar_posistion === this.bar_defualt_position) {
                            this.bar_posistion = this.bar_second_position
                        } else {
                            this.bar_posistion = this.bar_defualt_position
                        }
                    } else if (this.start_touch_position.x - this.end_touch_posistion.x < -50) { // SWIPE LEFT 
                        if (this.bar_posistion === this.bar_defualt_position) {
                            this.bar_posistion = this.bar_first_posistion
                        } else {
                            this.bar_posistion = this.bar_defualt_position
                        }
                    }
                }
                break
        }
    }

    pressEvent(option: 'first' | 'second') {
        this.bar_posistion = this.bar_defualt_position
        switch (option) {
            case "first":
                this.first_option_pressed.emit(this.first_option_return_value !== null ? this.first_option_return_value : undefined)
                break
            case "second":
                this.second_option_pressed.emit(this.second_option_return_value !== null ? this.second_option_return_value : undefined)
                break
        }
    }
}

export class ScrollBarOption {
    constructor(
        public color: string,
        public width_in_percent: number,
        public text: string | null,
        public image: string | null
    ) { }
}