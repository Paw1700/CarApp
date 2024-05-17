import { Component, inject } from "@angular/core";
import { RoutePageService } from "../../routes_page.service";

@Component({
    selector: 'route-deletion-box',
    standalone: true,
    templateUrl: './route_deletion_box.component.html',
    styleUrl: './route_deletion_box.component.scss'
})
export class RouteDeletionBox {
    PS = inject(RoutePageService)
    affectCar = false

    affectionOfCarState(e: any) {
        this.affectCar = e.target.checked
    }

    cancelDeletion() {
        this.PS.route_to_delete$.next(null)
    }

    deleteRoute() {
        this.PS.deleteRoute(this.PS.route_to_delete$.value!, this.affectCar)
    }
}