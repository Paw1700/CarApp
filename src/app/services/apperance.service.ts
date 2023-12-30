import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UpperBarState } from "../shared/models/upper-bar-state.model";

@Injectable()
export class AppApperance {
    upper_bar_state$ = new BehaviorSubject<UpperBarState>(new UpperBarState('TEST', 'TEST'))
}