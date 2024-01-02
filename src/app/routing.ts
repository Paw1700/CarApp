import { Routes } from '@angular/router';
import { SplashScreen } from './feature/splash_screen/splash_screen.page';
import { StartConfiguration } from './feature/start_configuration/start_configuration.page';
import { HomePage } from './feature/home_page/home_page.component';

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
    }
];
