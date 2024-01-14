import { Component } from "@angular/core";
import { AppEnvironment } from "../../environment";

@Component({
    standalone: true,
    selector: 'splash_screen',
    templateUrl: './splash_screen.page.html',
    styleUrl: './splash_screen.page.scss'
})
export class SplashScreen {
    app_version = AppEnvironment.APP_VERSION
    version_text = 'v' + this.app_version.edition + '.' + this.app_version.version + '.' + this.app_version.patch
}