import { Routes } from '@angular/router';
import { SplashScreen } from './feature/splash_screen/splash_screen.page';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: SplashScreen
    },
    {
        path: '**',
        pathMatch: "full",
        redirectTo: ""
    }
];
