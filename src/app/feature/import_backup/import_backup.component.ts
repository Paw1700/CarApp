import { Component, EventEmitter, Input, OnInit, Output, inject } from "@angular/core";
import { Backup } from "../../models/backup.model";
import { AppService } from "../../service";
import { AppVersionIteration } from "../../models/app_version.model";

@Component({
    selector: 'import-backup',
    standalone: true,
    templateUrl: './import_backup.component.html',
    styleUrl: './import_backup.component.scss'
})
export class ImportBackupComponent implements OnInit{
    private APP = inject(AppService)
    @Input() showCancelButton = true
    @Output() cancelButtonClicked = new EventEmitter<void>()
    import_text: string | null = null
    show_backup_data = false
    backup: Backup | undefined = undefined
    backup_info = {
        version: '',
        date: '',
        number_of_cars: '',
        number_of_routes: ''
    }
    show_paste_button = false

    ngOnInit(): void {
        this.show_paste_button = window.isSecureContext
    }

    cancelImport() {
        this.cancelButtonClicked.emit()
        this.import_text = null
        this.backup = undefined
        this.show_backup_data = false
    }

    async pasteBackupString() {
        if (this.show_paste_button) {
            const data = {target: {value: await navigator.clipboard.readText()}}
            this.handleBackupInput(data)
        }
    }

    doImport() {
        if (this.backup) {
            this.APP.APPERANCE.loading_screen_state$.next({show: true, loading_stage_text: 'Importowanie kopii zaposowej...'})
            setTimeout(async () => {
                if (this.backup) {
                    await this.APP.BACKUP.implementBackup(this.backup)
                    this.APP.APPERANCE.loading_screen_state$.next({show: false, loading_stage_text: ''})
                    this.APP.startApp()
                }
            }, 2500)
        }
    }

    async handleBackupInput(backupString: any) {
        this.import_text = backupString.target.value;
        if (this.import_text !== null && this.import_text.length >= 10) {
            this.show_backup_data = true
            this.backup = this.APP.BACKUP.readBackup(this.import_text)
            if (this.backup) {
                const app_version = this.APP.BACKUP.convertAppVersion(undefined, this.backup.appVersion) as AppVersionIteration
                this.backup_info.version = app_version.edition + "." + app_version.version + "." + app_version.patch + " " + app_version.compilation + app_version.compilationIteration
                const date = new Date(this.backup?.creationDate)
                this.backup_info.date = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
                this.backup_info.number_of_cars = this.backup.cars.length.toString()
                this.backup_info.number_of_routes = this.backup.routes.length.toString()
            }
        }
    }
}