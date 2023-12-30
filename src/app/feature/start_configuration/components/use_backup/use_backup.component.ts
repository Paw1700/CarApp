import { Component } from "@angular/core";

@Component({
    standalone: true,
    selector: 'use-backup',
    templateUrl: './use_backup.component.html',
    styleUrl: './use_backup.component.scss'
})
export class UseBackupComponent {
    view_mode: 'insert' | 'preview' = 'preview'
}