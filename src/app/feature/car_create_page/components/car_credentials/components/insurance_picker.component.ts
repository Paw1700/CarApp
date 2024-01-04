import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'ins-opt-picker',
    standalone: true,
    template: `
        <div class="INSURANCE_OPTIONS">
            <p>Ubezpieczenie zawiera</p>
            <div class="OPTIONS">
                <div class="OPTION">
                    <input type="checkbox" [value]="ins_opt.AC" (change)="emitNewOpt('AC', $event)"/>
                    <p>AC</p>
                </div>
                <div class="OPTION">
                    <input type="checkbox" [value]="ins_opt.NWW" (change)="emitNewOpt('NWW', $event)"/>
                    <p>NWW</p>
                </div>
                <div class="OPTION">
                    <input type="checkbox" [value]="ins_opt.Assistance" (change)="emitNewOpt('Assitance', $event)"/>
                    <p>Assistance</p>
                </div>
            </div>
        </div>
    `,
    styles: `
        div.INSURANCE_OPTIONS {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2.5vw;

            p {
                font-size: 1.2rem;
                font-weight: 600;
            }

            div.OPTIONS {
                display: flex;
                align-items: center;
                justify-content: space-evenly;
                width: 100%;

                div.OPTION {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    width: 25%;
                    gap: 1.25vw;

                    p {
                        font-size: 1rem;
                        font-weight: 500;
                    }
                }
            }
        }
    `
})
export class InsuranceOptionsPicker {
    @Input() ins_opt: InsOpt = {AC: false, NWW: false, Assistance: false}
    @Output() ins_opt_change = new EventEmitter<InsOpt>()

    emitNewOpt(type: 'AC' | 'NWW' | 'Assitance', event: any) {
        switch(type) {
            case "AC":
                this.ins_opt.AC = event.target.checked
                break
            case "NWW":
                this.ins_opt.NWW = event.target.checked
                break
            case "Assitance":
                this.ins_opt.Assistance = event.target.checked
                break
        }
        this.ins_opt_change.emit(this.ins_opt)
    }
}

export type InsOpt = {AC: boolean, NWW: boolean, Assistance: boolean}