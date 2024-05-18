import { Component, inject } from "@angular/core";
import { AppService } from "../../../service";
import { ErrorID } from "../../../models/error.model";

@Component({
    selector: 'reset-app',
    standalone: true,
    template: `
    <p class="TITLE">Reset aplikacji</p>
    @if (!show_confirm_window) {
        <button (click)="toogleConfirm(true)" class="RESET">RESET</button>
    } @else {
        <div class="CONFIRM_BOX_TEXT">
            <p>To działanie jest nie odwracalne </p>
            <p>Czy napewno chcesz to wykonać?</p>
        </div>
        <div class="BTNs">
            <button (click)="resetApp()" class="YES">TAK</button>
            <button (click)="toogleConfirm(false)" class="NO">NIE</button>
        </div>
    }
    `,
    styles: `
    :host {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2.5vw;

        p.TITLE {
            font-size: 1rem;
            font-weight: 700;
            width: 100%;
            text-align: left;
        }

        button {
            width: 100%;
            border-radius: 2.5vw;
            background-color: var(--accent-color);
            color: white;
            padding-block: 1.25vw;
            font-size: 1.25rem;
            font-weight: 600;
        }

        div.CONFIRM_BOX_TEXT {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.25vw;
            background-color: var(--app-elements);
            border-radius: 2.5vw;

            p {
                font-size: 1.25rem;

                &:last-of-type {
                    font-weight: 700;
                }
            }
        }

        div.BTNs {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            button {
                width: 45%;

                &.YES {
                    background-color: red;
                }
                &.NO {
                    background-color: green;
                }
            }
        }
    }
    `
})
export class ResetAppComponent {
    private APP = inject(AppService)
    show_confirm_window = false

    toogleConfirm(state: boolean) {
        this.show_confirm_window = state
    }

    resetApp() {
        this.APP.APPERANCE.loading_screen_state$.next({show: true, loading_stage_text: 'Resetowanie aplikacji...'})
        setTimeout(async () => {
            try {
                await this.APP.DATA.reset()
                await this.APP.startApp()
            } catch (err) {
                console.error(err);
                this.APP.errorHappend(err as ErrorID)
            }
        }, 2000)
    }
}