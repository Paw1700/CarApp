import { AppLocations } from "../types";

export class UpperBarState {
    constructor (
        public main_title = '',
        public seconde_title = '',
        public bar_mode: UpperBarModes = 'hidden',
        public return_location: AppLocations | null = null
    ) { }
}

export type UpperBarModes = 'small' | 'big' | 'hidden'