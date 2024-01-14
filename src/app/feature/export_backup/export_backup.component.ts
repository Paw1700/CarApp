import { Component, EventEmitter, Input, OnInit, Output, SecurityContext, inject } from "@angular/core";
import { AppService } from "../../service";

@Component({
    selector: 'export-backup',
    standalone: true,
    templateUrl: './export_backup.component.html',
    styleUrl: './export_backup.component.scss',
})
export class ExportBackupComponent implements OnInit{
    private APP = inject(AppService)
    @Input() generate_after_init = false
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
        this.APP.BACKUP.createBackup()
        .then( backup => {
            this.backup_string = JSON.stringify(backup)
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