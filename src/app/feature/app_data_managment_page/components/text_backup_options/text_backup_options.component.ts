import { Component, inject } from "@angular/core";
import { AppService } from "../../../../service";
import { ImportBackupComponent } from "../../../import_backup/import_backup.component";

@Component({
    selector: 'text-backup-options',
    standalone: true,
    imports: [ImportBackupComponent],
    templateUrl: './text_backup_options.component.html',
    styleUrl: './text_backup_options.component.scss'
})
export class TextBackupOptionsComponent {
    APP = inject(AppService)
    backup_mode: BackupModes = null

    changeBackupMode(mode: BackupModes) {
        this.backup_mode = mode
    }
}

export type BackupModes = 'import' | 'export' | null