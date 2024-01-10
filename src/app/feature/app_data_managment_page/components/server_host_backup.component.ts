import { Component } from "@angular/core";

@Component({
    selector: 'server-host-backup',
    standalone: true,
    template: `
    <div class="COMPONENT">
        <p class="TITLE">Synchronizacja z serwerem backup</p>
        <div class="WINDOW">JUŻ NIEDŁUGO!</div>
    </div>
    `,
    styles: `
    div.COMPONENT {
        width: 89vw;
        gap: 2.5vw;

        p.TITLE {
            font-size: 1rem;
            font-weight: 700;
            width: 100%;
            text-align: left;
        }

        div.WINDOW {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 15.25vw;
            background-color: var(--app-elements);
            border-radius: 2.5vw;
            font-weight: 700;
        }
    }
    `
})
export class ServerHostBackupComponent {

}