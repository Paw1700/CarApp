import { Component, EventEmitter, Input, OnInit, Output, SecurityContext, inject } from "@angular/core";
import { AppService } from "../../service";
import { AppEnvironment } from "../../environment";
import { AppDataMajorVersions } from "../../models/app_version.model";
import { ErrorID } from "../../models/error.model";

@Component({
    selector: 'export-backup',
    standalone: true,
    templateUrl: './export_backup.component.html',
    styleUrl: './export_backup.component.scss',
})
export class ExportBackupComponent implements OnInit{
    private APP = inject(AppService)
    @Input() app_version: AppDataMajorVersions = 'actual'
    @Input() generate_after_init = false
    @Input() show_close_button = true
    @Output() hideButtonClicked = new EventEmitter<void>()
    backup_string: string | null = null
    show_copy_btn = false

    ngOnInit(): void {
        if (this.generate_after_init) {
            this.generateBackup()
        }
        this.show_copy_btn = window.isSecureContext
    }

    generateBackup() {
        this.APP.BACKUP.createBackup(this.app_version)
        .then( backup => {
            this.backup_string = JSON.stringify(backup)
        })
        .catch(err => {
            console.error(err)
            this.APP.errorHappend(err as ErrorID)
        })
    }

    copyBackupString() {
        if (window.isSecureContext && this.backup_string) {
            navigator.clipboard.writeText(this.backup_string)
        }
    }

    hideWindow() {
        this.hideButtonClicked.emit()
    }
}