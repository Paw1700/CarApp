import { Component, OnInit, inject } from "@angular/core";
import { TitleBar } from "../../UI/title_bar/title_bar.component";
import { AppService } from "../../service";
import { AppDescComponent } from "./components/app_desc/app_desc.component";
import { AppChangesComponent } from "./components/app_changes/app_changes.component";
import { AppEnvironment } from "../../environment";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { NgUnsubscriber } from "../../util/ngUnsubscriber";

@Component({
    selector: 'about-app',
    standalone: true,
    imports: [TitleBar, AppDescComponent, AppChangesComponent],
    templateUrl: './about_app_page.component.html',
    styleUrl: './about_app_page.component.scss'
})
export class AboutAppPage extends NgUnsubscriber implements OnInit{
    private route = inject(ActivatedRoute)
    APP = inject(AppService)
    readonly app_version_data = AppEnvironment.APP_VERSION
    app_version = this.app_version_data.edition + '.' + this.app_version_data.version + '.' + this.app_version_data.patch
    app_compilation = this.app_version_data.compilation + this.app_version_data.compilationIteration
    app_important_chngs = this.app_version_data.important ? this.app_version_data.important : []
    app_feature_chngs = this.app_version_data.features ? this.app_version_data.features : []
    app_fixes_chngs = this.app_version_data.fixes ? this.app_version_data.fixes : []
    app_was_updated = false

    ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.ngUnsubscriber$)).subscribe(
            async params => {
                if (params['updated'] !== undefined) {
                    this.app_was_updated = true
                }
            }
        )
    }

    navigateAway() {
        if (this.app_was_updated) {
            this.APP.DATA.saveAppVersion(this.APP.BACKUP.convertAppVersion(AppEnvironment.APP_VERSION, undefined) as string)
            this.APP.navigate('home')
        } else {
            this.APP.navigate('settings')
        }
    }
}