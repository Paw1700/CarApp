import { Component, OnInit, inject } from '@angular/core';
import { AppLocations, AppService } from '../../service';
import { BottomBarState } from '../../services/apperance.service';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

@Component({
    selector: 'navbar',
    standalone: true,
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    animations: [
        trigger('navbar', [
            state(
                'false',
                style({
                    bottom: '-32vw',
                })
            ),
            state(
                'true',
                style({
                    bottom: 0,
                })
            ),
            transition('false => true', [animate('350ms ease-out')]),
            transition('true => false', [animate('350ms ease-in')]),
        ]),
    ],
})
export class NavBar implements OnInit {
    private APP = inject(AppService);
    bar_state: BottomBarState = new BottomBarState();
    selected_car_image: string = '';
    image_color_mode: 'black' | 'white' = 'black';
    private default_selected_car_image = '/assets/UI/selected_car/' + this.image_color_mode + '.webp';

    ngOnInit(): void {
        this.APP.APPERANCE.bottom_bar_state$.subscribe((state) => {
            this.bar_state = state;
            this.checkIfSelectedCarIconChanged();
        });
        this.APP.APPERANCE.dark_mode_state$.subscribe((dark_mode_on) => {
            if (dark_mode_on) {
                this.image_color_mode = 'white';
            } else {
                this.image_color_mode = 'black';
            }
            this.checkIfSelectedCarIconChanged();
        });
    }

    navigate(location: AppLocations): void {
        this.APP.navigate(location)
    }

    private checkIfSelectedCarIconChanged() {
        if (this.bar_state.choosed_car_brand !== null) {
            if (
                this.image_color_mode === 'white' &&
                this.bar_state.choosed_car_brand.image.for_dark_mode !== null
            ) {
                this.selected_car_image =
                    this.bar_state.choosed_car_brand.image.for_dark_mode;
            } else {
                this.selected_car_image =
                    this.bar_state.choosed_car_brand.image.default;
            }
        } else {
            this.setDefaultImage()
            this.selected_car_image = this.default_selected_car_image;
        }
    }

    private setDefaultImage() {
        this.default_selected_car_image = '/assets/UI/selected_car/' + this.image_color_mode + '.webp';
    }
}
