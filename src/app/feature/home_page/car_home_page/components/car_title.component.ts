import { Component, Input } from "@angular/core";

@Component({
    selector: 'car-title',
    standalone: true,
    template: `
    <div class="COMPONENT">
        <img [src]="brand_logo" />
        <p>{{ model_name }}</p>
    </div>
    `,
    styles: `
    div.COMPONENT {
        width: 100%;
        height: 100%;
        flex-direction: row;
        justify-content: space-between;
        padding-block: 2.5vw;

        img {
            width: 20%;
            height: 100%;
            object-fit: contain;
        }

        p {
            font-size: 1.25rem;
            font-weight: 700;
            color: white;
            width: 75%;
        }
    }
    `
})
export class CarTitle {
    @Input() brand_logo = ''
    @Input() model_name = ''
}