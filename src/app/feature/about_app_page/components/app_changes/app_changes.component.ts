import { Component, Input } from "@angular/core";
import { Feature } from "../../../../models/app_version.model";
import { FeatureComponent } from "./components/feature.component";

@Component({
    selector: 'app-changes',
    standalone: true,
    imports: [FeatureComponent],
    templateUrl: './app_changes.component.html',
    styleUrl: './app_changes.component.scss'
})
export class AppChangesComponent {
    @Input() importans: Feature[] = [new Feature(1, 'TEst', 'safa')]
    @Input() features: Feature[] = [new Feature(1, 'TEst', 'safa')]
    @Input() fixes: Feature[] = [new Feature(1, 'TEst', 'safa')] 
}