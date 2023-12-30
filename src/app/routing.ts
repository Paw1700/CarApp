import { Routes } from '@angular/router';
import { SplashScreen } from './feature/splash_screen/splash_screen.page';
import { StartConfiguration } from './feature/start_configuration/start_configuration.page';

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
    }
];
