import { Component, inject } from "@angular/core";
import { ChooseOptionComponent } from "./components/choose_option/choose_option.component";
import { StartConfigurationPageService } from "./start_configuration.service";
import { FreshStartComponent } from "./components/fresh_start/fresh_start.component";
import { UseBackupComponent } from "./components/use_backup/use_backup.component";

@Component({
    standalone: true,
    selector: 'start_configuration',
    templateUrl: './start_configuration.page.html',
    styleUrl: './start_configuration.page.scss',
    imports: [ChooseOptionComponent, FreshStartComponent, UseBackupComponent],
    providers: [StartConfigurationPageService]
})
export class StartConfiguration {
    
}