import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-desc',
    standalone: true,
    template: `
        <div class="ABOUT_APP">
            <img class="APP_LOGO">
            <div class="APP_DESC">
                <p class="TITLE">CarApp</p>
                <p class="VERSION">v{{ app_version_string }}</p>
                <p class="COMPILATION">({{ app_compilation_string }})</p>
            </div>
        </div>
    `,
    styles: `
        div.ABOUT_APP {
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            width: 89vw;

            img.APP_LOGO {
                width: 38.17vw;
                object-fit: contain;
                content: url('/assets/UI/car/black.webp');

                @media (prefers-color-scheme: dark) {
                    content: url('/assets/UI/car/white.webp');
                }
            }

            div.APP_DESC {
                display: flex;
                flex-direction: column;
                align-content: center;

                p.TITLE {
                    font-size: 1.5rem;
                    font-weight: 800;
                }

                p.VERSION {
                    font-size: 1rem;
                    font-weight: 600;
                }

                p.COMPILATION {
                    font-size: .75rem;
                    font-weight: 500;
                }
            }
        }
    `
})
export class AppDescComponent {
    @Input({required: true}) app_version_string: string = ''
    @Input({required: true}) app_compilation_string: string = ''
}