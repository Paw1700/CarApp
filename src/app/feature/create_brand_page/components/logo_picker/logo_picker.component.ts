import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'logo-picker',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './logo_picker.component.html',
    styleUrl: './logo_picker.component.scss',
})
export class LogoPickerComponent {
    @Output('main_logo') main_logo_emitter = new EventEmitter<string>();
    @Output('for_dark_mode_logo') for_dark_mode_logo_emitter = new EventEmitter<string>();
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
            this.for_dark_mode_logo_emitter.emit(logo)
        } else {
            this.main_logo = logo;
            this.main_logo_emitter.emit(logo);
        }
    }

    private resetError() {
        this.error.map(err => {err.file_size = false; err.image_type = false; return err})
    }
}
