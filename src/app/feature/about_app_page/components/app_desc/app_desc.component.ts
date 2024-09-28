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
                @if (app_beta_build === null) {
                    <p class="COMPILATION">({{ app_compilation_string }})</p>
                } @else {
                    <p class="BETA_TEXT">BETA</p>
                    <p class="BETA_BUILD">Build {{ app_beta_build }}</p>
                }
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
                content: url('/assets/UI/car/car.webp');
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

                p.BETA_TEXT {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: var(--default-accent-color);
                }
                
                p.BETA_BUILD {
                    color: var(--default-accent-color);
                    font-weight: 500;
                }
            }
        }
    `
})
export class AppDescComponent {
    @Input({required: true}) app_version_string: string = ''
    @Input({required: true}) app_compilation_string: string = ''
    @Input() app_beta_build: string | null = null
}