import { Injectable, inject } from '@angular/core';
import { AppApperance } from './services/apperance.service';
import { Router } from '@angular/router';
import { AppData } from './services/data/_main.service';
import { AppState } from './services/state.service';

@Injectable()
export class AppService {
    private ROUTER = inject(Router);
    constructor(
        public APPERANCE: AppApperance,
        public DATA: AppData,
        public STATE: AppState
    ) {}

    async startApp(): Promise<void> {
        let redirect_location: AppLocations = 'home';
        if (!this.checkIfIsConfigured()) {
            redirect_location = 'startConfig';
        }
        this.navigate('splashScreen');
        this.APPERANCE.setStatusBarColor(true);
        await this.DATA.start();
        this.APPERANCE.watchForDarkModeChange();
        setTimeout(() => {
            this.navigate(redirect_location);
        }, 500);
    }

    firstConfigureApp(fuel_config: number): void {
        this.DATA.saveFuelConfig(fuel_config);
        setTimeout(() => {
            this.navigate('home');
            console.log('NAVIGATE AWAY!');
        }, 1500);
    }

    private checkIfIsConfigured(): boolean {
        const fuel_config = this.DATA.getFuelConfig();
        if (fuel_config === null || fuel_config === 0) {
            return false;
        } else {
            return true;
        }
    }

    async navigate(location: AppLocations): Promise<void> {
        switch (location) {
            case 'splashScreen':
                this.ROUTER.navigateByUrl('/');
                this.APPERANCE.hideNavBar(true);
                break;
            case 'startConfig':
                this.ROUTER.navigateByUrl('/start');
                this.APPERANCE.hideNavBar(true);
                break;
            case 'home':
                this.ROUTER.navigateByUrl('/home');
                this.APPERANCE.setNavBarSelectedElement('selectedCar');
                this.APPERANCE.hideNavBar(false);
                break;
            case 'routes':
                this.APPERANCE.setNavBarSelectedElement('routes');
                this.APPERANCE.hideNavBar(false);
                break;
            case 'carsList':
                this.APPERANCE.setNavBarSelectedElement('cars')
                this.APPERANCE.hideNavBar(false)
                break;
            case 'settings':
                this.ROUTER.navigateByUrl('/settings')
                this.APPERANCE.setNavBarSelectedElement('settings');
                this.APPERANCE.hideNavBar(false);
                break;
            case 'newCar':
            case 'editCar':
            case 'carBrands':
            case 'newCarBrand':
            case 'editCarBrand':
            case 'backup':
            case 'aboutApp':
            case 'aboutApp/updated':
            case 'important':
                break;
        }
    }
}

export type AppLocations =
    | 'splashScreen'
    | 'home'
    | 'routes'
    | 'carsList'
    | 'newCar'
    | 'editCar'
    | 'settings'
    | 'carBrands'
    | 'newCarBrand'
    | 'editCarBrand'
    | 'startConfig'
    | 'backup'
    | 'aboutApp'
    | 'aboutApp/updated'
    | 'important';
