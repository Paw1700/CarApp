import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateBrandPageService } from '../../create_brand_page.service';
import { NgUnsubscriber } from '../../../../util/ngUnsubscriber';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'logo-picker',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './logo_picker.component.html',
    styleUrl: './logo_picker.component.scss',
})
export class LogoPickerComponent extends NgUnsubscriber implements OnInit{
    private PS = inject(CreateBrandPageService)
    main_logo: string | null = null;
    dark_mode_logo: string | null = null;
    not_use_dark_mode = false
    error = [{
        file_size: false,
        image_type: false,
    },{
        file_size: false,
        image_type: false,
    }];

    ngOnInit(): void {
        this.PS.brand_logo_default$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe( image => {
            if (image !== '') {
                this.main_logo = image
            }
        })
        this.PS.brand_logo_for_dark_mode$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe( image => {
            if (image !== null) {
                this.dark_mode_logo = image
            } else if (this.main_logo !== null) {
                this.not_use_dark_mode = true
            }
        })
    }

    async handleInputImage(forDarkMode: boolean, image: any) {
        this.resetError()
        const file: File = image.target.files[0];
        if (file === undefined) {
            console.error('Image not found!');
            return;
        }
        if (file.size > 50_000) {
            let i = 0
            if (forDarkMode) {
                i = 1
            }
            this.error[i].file_size = true
            return;
        }
        if (file.type !== 'image/webp') {
            let i = 0
            if (forDarkMode) {
                i = 1
            }
            this.error[i].image_type = true
            return;
        }
        const image_in_base64 = await this.convertImageToBase64(file);
        this.setLogo(forDarkMode, image_in_base64)
    }

    toogleNotUseDarkMode(): void {
        this.not_use_dark_mode = !this.not_use_dark_mode
    }

    private convertImageToBase64(image: File): Promise<string> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(image);
        });
    }

    private setLogo(forDarkMode: boolean, logo: string): void {
        if (forDarkMode) {
            this.dark_mode_logo = logo;
            this.PS.brand_logo_for_dark_mode$.next(logo)
        } else {
            this.main_logo = logo;
            this.PS.brand_logo_default$.next(logo)
        }
    }

    private resetError() {
        this.error.map(err => {err.file_size = false; err.image_type = false; return err})
    }
}
