import { Component, inject } from "@angular/core";
import { TitleBar } from "../../UI/title_bar/title_bar.component";
import { AppService } from "../../service";
import { AppDescComponent } from "./components/app_desc/app_desc.component";
import { AppChangesComponent } from "./components/app_changes/app_changes.component";

@Component({
    selector: 'about-app',
    standalone: true,
    imports: [TitleBar, AppDescComponent, AppChangesComponent],
    templateUrl: './about_app_page.component.html',
    styleUrl: './about_app_page.component.scss'
})
export class AboutAppPage {
    APP = inject(AppService)
}