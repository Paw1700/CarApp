import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: 'select-input',
    standalone: true,
    templateUrl: './select_input.component.html',
    styleUrl: './select_input.component.scss'
})
export class SelectInputComponent implements OnInit{
    @Input({required: true}) select_list: (Object & {name: string})[] = []
    @Input({required: true}) title = ''
    @Input() input_selected_item = -1
    @Input() show_empty_opt = true
    @Output() selected_item = new EventEmitter<any>()
    choosed_element_index = -1
    select_active = false
    show_list = false
    arrow_path = {unactive: "M35.8553 0.909224L0.5 36.2646L165.963 201.728L166.818 200.872L167.264 201.318L332.727 35.8552L297.372 0.499907L166.409 131.463L35.8553 0.909224Z", active: "M296.872 200.818L332.228 165.463L166.765 0L165.909 0.855374L165.463 0.40931L0.00012207 165.872L35.3555 201.228L166.318 70.2646L296.872 200.818Z"}

    ngOnInit(): void {
        this.checkIfInputSelectedItemChanged()
        this.toogleSelectActiveState(false)
    }

    toogleSelectActiveState(value?: boolean) {
        if (this.choosed_element_index !== -1) {
            this.select_active = true
            if (value !== undefined) {
                this.show_list = value
            } else {
                this.show_list = !this.show_list
            }
        } else if(value !== undefined) {
            this.select_active = value
            this.show_list = value
        } else {
            this.select_active = !this.select_active
            this.show_list = !this.show_list
        }
    }

    element_choosed(i: number) {
        this.choosed_element_index = i
        this.toogleSelectActiveState(false)
        if (i == -1) {
            this.selected_item.emit(null)
        } else {
            this.selected_item.emit(this.select_list[i])
        }
    }

    private checkIfInputSelectedItemChanged() {
        setTimeout(() => {
            if (this.input_selected_item != -1) {
                this.choosed_element_index = this.input_selected_item
                this.toogleSelectActiveState(false)
            }
        }, 50);
    }
}