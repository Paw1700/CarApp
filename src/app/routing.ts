import { Routes } from '@angular/router';
import { SplashScreen } from './feature/splash_screen/splash_screen.page';
import { StartConfiguration } from './feature/start_configuration/start_configuration.page';
import { HomePage } from './feature/home_page/home_page.component';
import { SettingsPage } from './feature/settings_page/settings_page.component';
import { AboutAppPage } from './feature/about_app_page/about_app_page.component';
import { BrandListPage } from './feature/brand_list_page/brand_list_page.component';
import { CreateBrandPage } from './feature/create_brand_page/create_brand_page.component';

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
    }
];
