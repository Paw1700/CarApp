import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class StartConfigurationPageService {
    view_mode$ = new BehaviorSubject<StartConfigViewModes>('start')
}

export type StartConfigViewModes = 'start' | 'backup' | 'fresh_start'