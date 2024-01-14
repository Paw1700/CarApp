import { Component, OnInit, inject } from "@angular/core";
import { AppService } from "../../service";
import { ExportBackupComponent } from "../export_backup/export_backup.component";
import { AppDataMajorVersions, AppVersionIteration } from "../../models/app_version.model";

@Component({
    selector: 'important-page',
    standalone: true,
    imports: [
        ExportBackupComponent
    ],
    templateUrl: "./important_page.component.html",
    styleUrl: './important_page.component.scss'
})
export class ImportantPage implements OnInit{
    APP = inject(AppService)
    app_version: AppDataMajorVersions = 'actual'

    ngOnInit(): void {
        this.specifyUserAppVersion()
    }

    updateAppData() {
        this.APP.APPERANCE.loading_screen_state$.next({show: true, loading_stage_text: 'AKTULIZOWANIE...'})
        setTimeout(async () => {
            try {
                const old_data = await this.APP.BACKUP.createBackup(this.app_version)
                const updated_data = this.APP.BACKUP.convertOldBackupToActual(JSON.stringify(old_data), this.app_version)
                await this.APP.BACKUP.implementBackup(updated_data)
                await this.APP.startApp(true)
                this.APP.navigate('aboutApp/updated')
                this.APP.APPERANCE.loading_screen_state$.next({show: false, loading_stage_text: ''})
            } catch (err) {
                console.error(err);
            }
        }, 1250)
    }

    private specifyUserAppVersion() {
        const user_AV_string = this.APP.DATA.getAppVersion()! // USER GET IN THIS PAGE ONLY IF APP VERSION IS NOT NULL
        if (user_AV_string === '14') {
            this.app_version = '2.0.5'
            return 
        }
        const user_AV = this.APP.BACKUP.convertAppVersion(undefined, user_AV_string) as AppVersionIteration
        if (user_AV.edition <= 2 && user_AV.version <= 1 && user_AV.patch <= 3) {
            this.app_version = '2.1.3'
            return
        }
    }
}