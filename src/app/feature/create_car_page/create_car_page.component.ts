import { Component, OnInit, inject } from "@angular/core";
import { TitleBar } from "../../UI/title_bar/title_bar.component";
import { AppService } from "../../service";
import { TextInputComponent } from "../../UI/forms/text_input/text_input.component";
import { CarPhotoPicker } from "./components/car_photo_picker/car_photo_picker.component";
import { ScrollAbleTabs } from "../../UI/scroll_tabs/scroll_tabs.component";
import { CarCredentialsComponent } from "./components/car_credentials/car_credentials.component";
import { CarCreatePageService } from "./create_car_page.service";
import { NgUnsubscriber } from "../../util/ngUnsubscriber";
import { takeUntil } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { CarDBModel } from "../../models/car.model";

@Component({
    selector: 'car-create-page',
    standalone: true,
    imports: [TitleBar, TextInputComponent, CarPhotoPicker, ScrollAbleTabs, CarCredentialsComponent],
    providers: [CarCreatePageService],
    templateUrl: './create_car_page.component.html',
    styleUrl: './create_car_page.component.scss'
})
export class CarCreatePage extends NgUnsubscriber implements OnInit {
    private route = inject(ActivatedRoute)
    private PS = inject(CarCreatePageService)
    APP = inject(AppService)
    car_front_left_photo = ''
    car_side_photo = ''

    ngOnInit(): void {
        this.checkIfEnterEditMode()
        this.readCarPhotoState()
    }

    handleCarPhoto(type: 'front_left' | 'side', image: string) {
        const car_data = this.PS.car_data$.value
        switch (type) {
            case "front_left":
                car_data.photo.front_left = image
                break
            case "side":
                car_data.photo.side = image
                break
        }
        this.PS.car_data$.next(car_data)
    }

    private readCarPhotoState() {
        this.PS.car_data$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe(car_data => {
            this.car_front_left_photo = car_data.photo.front_left
            this.car_side_photo = car_data.photo.side
        })
    }

    private checkIfEnterEditMode() {
        this.route.params.pipe(takeUntil(this.ngUnsubscriber$)).subscribe( async params => {
            if (params['id'] !== undefined) {
                this.PS.edit_mode$.next(true)
                this.PS.car_data$.next(await this.APP.DATA.CAR.getOne(params['id'], true) as CarDBModel)
            }
        } )
    }
}