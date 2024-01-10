import { Component, Input } from "@angular/core";
import { Feature } from "../../../../../models/app_version.model";

@Component({
    selector: 'feature',
    standalone: true,
    template: `
    <div class="COMPONENT">
        <div class="TYPE" [class.IMPORTANT]="type === 'important'" [class.FEATURE]="type === 'feature'" [class.FIX]="type === 'fix'">
            @switch (type) {
                @case ("important") {!!!}
                @case ("feature") {NEW}
                @case ("fix") {FIX}
            }
        </div>
        <div class="CHANGE_DESC">
            <p class="TITLE">{{ feature.title }}</p>
            <p class="DESC">{{ feature.description }}</p>
        </div>
    </div>
    `,
    styles: `
    div.COMPONENT {
        flex-direction: row;
        justify-content: space-between;
        width: 100%;

        div.TYPE {
            padding: .25vw;
            font-size: 1.5rem;
            font-weight: 700;
            border: 3px solid;
            border-radius: 2vw;
            width: 20%;
            height: 1.75rem;

            &.IMPORTANT {
                border-color: red;
                color:red
            }

            &.FEATURE {
                border-color: blue;
                color: blue;
            }

            &.FIX {
                border-color: green;
                color: green;
            }
        }

        div.CHANGE_DESC {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            width: 75%;

            p.TITLE {
                font-size: 1.5rem;
                font-weight: 700;
                text-align: left;
            }
            
            p.DESC {
                font-size: 1rem;
                font-weight: 500;
                text-align: left;
            }
        }
    }
    `
})
export class FeatureComponent {
    @Input({required: true}) feature: Feature = new Feature(0, '', undefined)
    @Input({required: true}) type: FeatureType = 'feature'
}

export type FeatureType = 'important' | 'feature' | 'fix'