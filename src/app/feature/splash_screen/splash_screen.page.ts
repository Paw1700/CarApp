import { Component, inject } from "@angular/core";
import { AppService } from "../../service";

@Component({
    standalone: true,
    selector: 'splash_screen',
    templateUrl: './splash_screen.page.html',
    styleUrl: './splash_screen.page.scss'
})
export class SplashScreen {
    private APP = inject(AppService)
    image_color_mode = this.APP.APPERANCE.checkIsDarkMode() ? 'white' : 'black'
}