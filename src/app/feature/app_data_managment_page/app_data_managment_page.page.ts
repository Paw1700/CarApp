import { Component, inject } from "@angular/core";
import { TitleBar } from "../../UI/title_bar/title_bar.component";
import { AppService } from "../../service";
import { ServerHostBackupComponent } from "./components/server_host_backup.component";
import { TextBackupOptionsComponent } from "./components/text_backup_options/text_backup_options.component";
import { ResetAppComponent } from "./components/reset_app.component";

@Component({
    selector: 'app-data-managment-page',
    standalone: true,
    imports: [TitleBar, ServerHostBackupComponent, TextBackupOptionsComponent, ResetAppComponent],
    templateUrl: './app_data_managment_page.page.html',
    styleUrl: './app_data_managment_page.page.scss'
})
export class AppDataManagmentPage {
    APP = inject(AppService)
}