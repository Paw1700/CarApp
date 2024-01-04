import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'scroll-able-tabs',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './scroll_tabs.component.html',
    styleUrl: './scroll_tabs.component.scss'
})
export class ScrollAbleTabs implements OnInit{
    @Input({required: true}) tabs_number = 1
    @Input({required: true}) tab_width_in_vw = 100
    @Input() scroll_mode: 'horizontal' | 'vertical' = 'horizontal'
    tab_left_offset = 0
    private tab_viewed = 1
    private start_touch_position = {x: 0, y: 0}
    private end_touch_posistion = {x: 0, y: 0}
    private readonly diff_Y_limit = 50
    private readonly diff_X_trigger_point = 50

    ngOnInit(): void {
        this.updateTabOffset()
    }
    
    updateTabOffset(move_to_tab = 0) {
        const start_position = (this.tabs_number / 2) * (this.tab_width_in_vw / this.tabs_number) - (this.tab_width_in_vw / this.tabs_number) / 2 
        const move_offset = this.tab_width_in_vw * 100 / (this.tab_width_in_vw * this.tabs_number)
        if (move_to_tab >= this.tabs_number) {
            move_to_tab = this.tabs_number - 1
        } else if (move_to_tab < 0) {
            move_to_tab = 0
        }
        this.tab_left_offset = start_position - (move_to_tab * move_offset)
    }

    handleScrollEvent(e: TouchEvent, type: 'start' | 'end'): void {
        switch(type) {
            case "start":
                this.start_touch_position.x = e.changedTouches[0].clientX
                this.start_touch_position.y = e.changedTouches[0].clientY
                break
            case "end":
                this.end_touch_posistion.x = e.changedTouches[0].clientX
                this.end_touch_posistion.y = e.changedTouches[0].clientY
                const position_x_diff = this.start_touch_position.x - this.end_touch_posistion.y
                const position_y_diff = this.start_touch_position.y - this.end_touch_posistion.y
                if (Math.abs(position_y_diff) < this.diff_Y_limit) {
                    if (position_x_diff > this.diff_X_trigger_point)  {// SWIPE TO LEFT <--- 
                        this.tab_viewed += 1
                        if (this.tab_viewed > this.tabs_number) {
                            this.tab_viewed = this.tabs_number - 1
                        }
                        this.updateTabOffset(this.tab_viewed)
                    }
                    if (position_x_diff < -this.diff_X_trigger_point) { // SWIPE TO RIGHT -->
                        this.tab_viewed -= 1
                        if (this.tab_viewed < 0) {
                            this.tab_viewed = 0
                        }
                        this.updateTabOffset(this.tab_viewed)
                    }
                }
                break
        }
    }
}