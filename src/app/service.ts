import { Injectable, inject } from "@angular/core";
import { AppApperance } from "./services/apperance.service";
import { AppLocations } from "./data/types";
import { Router } from "@angular/router";
import { AppData } from "./services/data/_main.service";

@Injectable()
export class AppService {
    private ROUTER = inject(Router)
    constructor(public APPERANCE: AppApperance, public DATA: AppData) { }

    async startApp(): Promise<void> {
        this.navigate('splashScreen')
        this.APPERANCE.watchForDarkModeChange()
        setTimeout(() => {
            this.navigate('startConfig')
        }, 500)
    }

    async navigate(location: AppLocations): Promise<void> {
        switch (location) {
            case "splashScreen":
                this.ROUTER.navigateByUrl('/')
                break
            case "startConfig":
                this.ROUTER.navigateByUrl('/start')
                break
            case "home":
            case "routes":
            case "carsList":
            case "newCar":
            case "editCar":
            case "settings":
            case "carBrands":
            case "newCarBrand":
            case "editCarBrand":
            case "backup":
            case "aboutApp":
            case "aboutApp/updated":
            case "important":
                break
        }
    }
}