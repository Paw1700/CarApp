import { Injectable, inject } from '@angular/core';
import { AppApperance } from './services/apperance.service';
import { Router } from '@angular/router';
import { AppData } from './services/data/_main.service';
import { AppBackup } from './services/backup.service';
import { Car } from './models/car.model';
import { AppEnvironment } from './environment';
import { AppVersionIteration } from './models/app_version.model';

@Injectable()
export class AppService {
    private ROUTER = inject(Router);
    constructor(
        public APPERANCE: AppApperance,
        public DATA: AppData,
        public BACKUP: AppBackup
    ) { }

    async startApp(withoutRedirection = false): Promise<void> {
        let redirect_location: AppLocations = 'home';
        let status_normal = true
        if (!this.checkIfIsConfigured()) {
            redirect_location = 'startConfig';
        }
        this.navigate('splashScreen');
        this.APPERANCE.setStatusBarColor(true);
        if (this.checkIfAppWasUpdated() === true) {
            redirect_location = 'aboutApp/updated'
        } else if (this.checkIfAppWasUpdated() === 'major') {
            status_normal = false
            redirect_location = 'important'
        }
        if (status_normal) {
            await this.DATA.start();
            const carID = this.DATA.getChoosedCarID()
            if (carID) {
                const car = await this.DATA.CAR.getOne(carID) as Car
                this.APPERANCE.setAppColor(car.color.theme, car.color.accent)
                this.APPERANCE.setChoosedCarBrandInNavBar({ name: car.brand.name, image: car.brand.brand_image_set })
            }
            this.APPERANCE.watchForDarkModeChange();
            // redirect_location = 'important'// <-- RENAVIGATE WHEN CREATING PAGE
            if (!withoutRedirection) {
                setTimeout(() => {
                    this.navigate(redirect_location);
                }, 500);
            } else {
                return Promise.resolve()
            }
        } else {
            if (!withoutRedirection) {
                setTimeout(() => {
                    this.navigate(redirect_location);
                }, 1500);
            }else {
                return Promise.resolve()
            }
        }
    }

    firstConfigureApp(fuel_config: number): void {
        this.DATA.saveFuelConfig(fuel_config);
        setTimeout(() => {
            this.navigate('home');
        }, 1500);
    }

    async setChoosedCar(carID: string | null) {
        this.DATA.saveChoosedCarID(carID)
        if (carID) {
            const car = await this.DATA.CAR.getOne(carID) as Car
            this.APPERANCE.setAppColor(car.color.theme, car.color.accent)
            this.APPERANCE.setChoosedCarBrandInNavBar({ name: car.brand.name, image: car.brand.brand_image_set })
        } else {
            this.APPERANCE.setAppColor(null)
            this.APPERANCE.setChoosedCarBrandInNavBar(null)
        }
    }

    private checkIfIsConfigured(): boolean {
        const fuel_config = this.DATA.getFuelConfig();
        if (fuel_config === null || fuel_config === 0) {
            return false;
        } else {
            return true;
        }
    }

    private checkIfAppWasUpdated(): 'major' | boolean {
        const user_AV_string = this.DATA.getAppVersion()
        const actual_AV = AppEnvironment.APP_VERSION
        if (user_AV_string === null) {
            return true
        }
        const user_AV = this.BACKUP.convertAppVersion(undefined, user_AV_string) as AppVersionIteration
        if ( (user_AV.edition <= 2 && user_AV.version <= 1 && user_AV.patch <= 3) || user_AV_string === '14' ) {
            return 'major'
        }
        if ( actual_AV.edition > user_AV.edition || actual_AV.version > user_AV.version || actual_AV.patch > user_AV.patch ) {
            return true
        }
        return false
    }

    async navigate(location: AppLocations, additionalURLData?: string): Promise<void> {
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
                this.ROUTER.navigateByUrl('/routes');
                this.APPERANCE.setNavBarSelectedElement('routes');
                this.APPERANCE.hideNavBar(false);
                break;
            case 'carsList':
                this.ROUTER.navigateByUrl('/carsList');
                this.APPERANCE.setNavBarSelectedElement('cars');
                this.APPERANCE.hideNavBar(false);
                break;
            case 'settings':
                this.ROUTER.navigateByUrl('/settings');
                this.APPERANCE.setNavBarSelectedElement('settings');
                this.APPERANCE.hideNavBar(false);
                break;
            case 'aboutApp':
                this.ROUTER.navigateByUrl('/aboutApp');
                this.APPERANCE.setNavBarSelectedElement(null);
                this.APPERANCE.hideNavBar(true);
                break;
            case 'carBrands':
                this.ROUTER.navigateByUrl('/brandList');
                this.APPERANCE.setNavBarSelectedElement(null);
                this.APPERANCE.hideNavBar(true);
                break;
            case 'newCarBrand':
                this.ROUTER.navigateByUrl('/brandList/create');
                this.APPERANCE.setNavBarSelectedElement(null);
                this.APPERANCE.hideNavBar(true);
                break
            case 'editCarBrand':
                if (additionalURLData === undefined) {
                    console.error(`Did not provided needed additional data for navigation for ${location}`)
                    return
                }
                this.ROUTER.navigateByUrl('/brandList/create/' + additionalURLData)
                this.APPERANCE.setNavBarSelectedElement(null);
                this.APPERANCE.hideNavBar(true);
                break
            case 'newCar':
                this.ROUTER.navigateByUrl('/carsList/create')
                this.APPERANCE.setNavBarSelectedElement(null);
                this.APPERANCE.hideNavBar(true);
                break
            case 'editCar':
                if (additionalURLData === undefined) {
                    console.error(`Did not provided needed additional data for navigation for ${location}`)
                    return
                }
                this.ROUTER.navigateByUrl('/carsList/create/' + additionalURLData)
                this.APPERANCE.setNavBarSelectedElement(null);
                this.APPERANCE.hideNavBar(true);
                break
            case 'appDataManagment':
                this.ROUTER.navigateByUrl('/appDataManagment')
                this.APPERANCE.setNavBarSelectedElement(null);
                this.APPERANCE.hideNavBar(true);
                break
            case 'aboutApp/updated':
                this.ROUTER.navigateByUrl('aboutApp/true')
                this.APPERANCE.setNavBarSelectedElement(null);
                this.APPERANCE.hideNavBar(true);
                break
            case 'important':
                this.ROUTER.navigateByUrl('important')
                this.APPERANCE.setNavBarSelectedElement(null);
                this.APPERANCE.hideNavBar(true);
                break
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
    | 'appDataManagment'
    | 'aboutApp'
    | 'aboutApp/updated'
    | 'important';
