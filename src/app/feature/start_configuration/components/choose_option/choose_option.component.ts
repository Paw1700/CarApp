import { Component, EventEmitter, Output } from "@angular/core";
import { StartConfigViewModes } from "../../start_configuration.page";

@Component({
    standalone: true,
    selector: 'choose-option',
    templateUrl: './choose_option.component.html',
    styleUrl: './choose_option.component.scss',
})
export class ChooseOptionComponent {
    @Output() viewModeChanged = new EventEmitter<StartConfigViewModes>()

    changeView(view: StartConfigViewModes) {
        this.viewModeChanged.emit(view)
    }
}