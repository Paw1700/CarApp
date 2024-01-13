import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Route } from "../../../../models/route.model";
import { ScrollAbleBar } from "../../../../UI/scroll_able_bar/scroll_able_bar.component";
import { AppEnvironment } from "../../../../environment";

@Component({
    selector: 'route-list-item',
    standalone: true,
    imports: [ScrollAbleBar],
    templateUrl: './route_list_item.component.html',
    styleUrl: './route_list_item.component.scss'
})
export class RouteListItem implements OnInit{
    @Input({required: true}) route = new Route()
    @Output() edit_this_one = new EventEmitter<Route>()
    @Output() delete_this_one = new EventEmitter<Route>()
    combustion_usage = 0
    combustion_used = 0
    electric_usage = 0
    electric_used = 0

    ngOnInit(): void {
        if (this.route.usage.combustion.include) {
            this.combustion_usage = this.route.usage.electric.amount !== 0 ? this.route.usage.combustion.amount / AppEnvironment.APP_FINAL_VARIABLES.combustion_engine_hybrid_usage_ratio : this.route.usage.combustion.amount
            this.combustion_used = this.route.distance * (this.combustion_usage / 100)
        }
        if (this.route.usage.electric.include) {
            this.electric_usage = this.route.usage.electric.amount
            this.electric_used = this.route.distance * (this.electric_usage / 100)
        }
    }

    edit() {
        this.edit_this_one.emit(this.route)
    }

    delete() {
        this.delete_this_one.emit(this.route)
    }
}