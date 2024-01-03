import { Component, OnInit, inject } from "@angular/core";
import { TitleBar } from "../../UI/title_bar/title_bar.component";
import { AppService } from "../../service";
import { LogoPickerComponent } from "./components/logo_picker/logo_picker.component";
import { ButtonComponent, ButtonTypes } from "../../UI/button/button.component";
import { TextInputComponent } from "../../UI/forms/text_input.component";
import { Loader } from "../../UI/loaders/loader.component";
import { NgUnsubscriber } from "../../util/ngUnsubscriber";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs";
import { CreateBrandPageService } from "./create_brand_page.service";

@Component({
    selector: 'create-brand-page',
    standalone: true,
    imports: [TitleBar, LogoPickerComponent, ButtonComponent, TextInputComponent, Loader],
    providers: [CreateBrandPageService],
    templateUrl: './create_brand_page.component.html',
    styleUrl: './create_brand_page.component.scss'
})
export class CreateBrandPage extends NgUnsubscriber implements OnInit {
    private route = inject(ActivatedRoute)
    private PS = inject(CreateBrandPageService)
    APP = inject(AppService)
    readonly border_dimenions = {
        width: 89,
        height: 12.5,
        border_radius: 2.5,
    }
    btn_type: ButtonTypes = 'accent'
    brand_name: string = '';
    data_fetching = false;
    error = false;

    ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.ngUnsubscriber$)).subscribe(
            async params => {
                if (params['id'] !== undefined) {
                    this.PS.brand_id$.next(params['id'])
                }
            }
        )
        this.PS.brand_name$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe(name => {
            this.brand_name = name
        })
    }

    handleCarNameInputEmit(name: string) {
        this.PS.brand_name$.next(name)
    }

    saveBrand() {
        this.data_fetching = true;
        setTimeout(() => {
            this.PS.saveBrand()
                .then(
                    () => {
                        this.data_fetching = false;
                    }
                )
                .catch(
                    err => {
                        this.data_fetching = false;
                        this.toogleError(true);
                        setTimeout(() => {
                            this.toogleError(false);
                        }, 1500)
                    }
                )
        }, 1000)
    }

    private toogleError(bool: boolean) {
        if (!bool) {
            this.error = false;
            this.btn_type = 'accent'
        } else {
            this.error = true;
            this.btn_type = 'error'
        }
    }
}