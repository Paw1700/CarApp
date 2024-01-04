import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: 'car-photo-picker',
    standalone: true,
    templateUrl: './car_photo_picker.component.html',
    styleUrl: './car_photo_picker.component.scss'
})
export class CarPhotoPicker implements OnInit{
    @Input() photo_title = 'TITLE'
    @Input() input_photo: string = ''
    @Output() received_photo = new EventEmitter<string>()
    photo = ''
    error_file_size = false
    error_image_type = false

    ngOnInit(): void {
        this.checkIfPhotoWasSetted()
    }

    async handleInputImage(image: any) {
        this.resetError()
        const file: File = image.target.files[0];
        if (file === undefined) {
            this.photo = ''
            console.error('Image not found!');
            return;
        }
        if (file.size > 150_000) {
            this.error_file_size = true
            return;
        }
        if (file.type !== 'image/webp') {
            this.error_image_type = true
            this.photo = ''
            return;
        }
        const image_in_base64 = await this.convertImageToBase64(file);
        this.setLogo(image_in_base64)
    }

    private resetError() {
        this.error_file_size = false
        this.error_image_type = false
    }

    private setLogo(image: string) {
        this.photo = image
        this.received_photo.emit(image)
    }

    private checkIfPhotoWasSetted() {
        setTimeout(() => {
            if (this.input_photo !== '') {
                this.photo = this.input_photo
            }
        }, 50);
    }

    private convertImageToBase64(image: File): Promise<string> {
        return new Promise((resolve) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(image);
        });
    }
}