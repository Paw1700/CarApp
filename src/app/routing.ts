import { Routes } from '@angular/router';
import { SplashScreen } from './feature/splash_screen/splash_screen.page';
import { StartConfiguration } from './feature/start_configuration/start_configuration.page';
import { HomePage } from './feature/home_page/home_page.component';
import { SettingsPage } from './feature/settings_page/settings_page.component';
import { AboutAppPage } from './feature/about_app_page/about_app_page.component';
import { BrandListPage } from './feature/brand_list_page/brand_list_page.component';
import { CreateBrandPage } from './feature/create_brand_page/create_brand_page.component';
import { CarsListPage } from './feature/cars_list_page/cars_list_page.component';
import { CarCreatePage } from './feature/create_car_page/create_car_page.component';
import { AppDataManagmentPage } from './feature/app_data_managment_page/app_data_managment_page.page';
import { RoutesPage } from './feature/routes_page/routes_page.component';
import { ImportantPage } from './feature/important_page/important_page.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: SplashScreen,
        data: {
            animState: 'splashScreen'
        }
    },
    {
        path: 'start',
        pathMatch: "full",
        component: StartConfiguration,
        data: {
            animState: 'startConfig'
        }
    },
    {
        path: 'home',
        pathMatch: "full",
        component: HomePage,
        data: {
            animState: 'home'
        }
    },
    {
        path: 'settings',
        pathMatch: "full",
        component: SettingsPage,
        data: {
            animState: 'settings'
        }
    },
    {
        path: 'aboutApp',
        pathMatch: "full",
        component: AboutAppPage,
        data: {
            animState: 'aboutApp'
        }
    },
    {
        path: 'brandList',
        pathMatch: "full",
        component: BrandListPage,
        data: {
            animState: 'brandList'
        }
    },
    {
        path: 'brandList/create',
        pathMatch: "full",
        component: CreateBrandPage,
        data: {
            animState: 'createBrand'
        }
    },
    {
        path: 'brandList/create/:id',
        pathMatch: "full",
        component: CreateBrandPage,
        data: {
            animState: 'createBrand'
        }
    },
    {
        path: 'carsList',
        pathMatch: "full",
        component: CarsListPage,
        data: {
            animState: 'carsList'
        }
    },
    {
        path: 'carsList/create',
        pathMatch: "full",
        component: CarCreatePage,
        data: {
            animState: 'carCreate'
        }
    },
    {
        path: 'carsList/create/:id',
        pathMatch: "full",
        component: CarCreatePage,
        data: {
            animState: 'carCreate'
        }
    },
    {
        path: 'appDataManagment',
        pathMatch: 'full',
        component: AppDataManagmentPage,
        data: {
            animState: 'appDataManagment'
        }
    },
    {
        path: 'routes',
        pathMatch: 'full',
        component: RoutesPage,
        data: {
            animState: 'routesList'
        }
    },
    {
        path: 'aboutApp/:updated',
        pathMatch: 'full',
        component: AboutAppPage,
        data: {
            animState: 'aboutApp'
        }
    },
    {
        path: 'important',
        pathMatch: 'full',
        component: ImportantPage,
        data: {
            animState: 'important'
        }
    }
];
