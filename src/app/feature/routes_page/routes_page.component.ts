import { animate, style, transition, trigger } from '@angular/animations';
import { routes } from './../../routing';
import { Component, OnInit, inject } from "@angular/core";
import { TitleBar } from "../../UI/title_bar/title_bar.component";
import { AppService } from "../../service";
import { Route } from "../../models/route.model";
import { NotChoosedCarComponent } from "../../UI/not_choosed_car/not_choosed_car.component";
import { RouteListItem } from './components/route_list_item/route_list_item.component';
import { StringDate } from './pipes/stringDate.pipe';
import { RouteEditor } from './components/route_editor/route_editor.component';
import { RoutePageList, RoutePageService } from './routes_page.service';
import { NgUnsubscriber } from '../../util/ngUnsubscriber';
import { takeUntil } from 'rxjs';
import { ButtonComponent } from '../../UI/button/button.component';

@Component({
    selector: 'routes-page',
    standalone: true,
    imports: [
        NotChoosedCarComponent,
        TitleBar,
        RouteListItem,
        StringDate,
        RouteEditor,
        ButtonComponent
    ],
    providers: [
        RoutePageService
    ],
    templateUrl: "./routes_page.component.html",
    styleUrl: './routes_page.component.scss',
    animations: [
        trigger('show_up', [
            transition("void => *", [
                style({
                    position: 'relative',
                    top: '2.5vh',
                    opacity: 0
                }),
                animate('350ms ease-out', style({
                    top: 0,
                    opacity: 1
                }))
            ])
        ]),
        trigger('editor', [
            transition("void => *", [
                style({
                    opacity: 0
                }),
                animate('350ms ease-out', style({
                    opacity: 1
                }))
            ]),
            transition('* => void', [
                animate('350ms ease-in', style({
                    opacity: 0
                }))
            ])
        ])
    ]
})
export class RoutesPage extends NgUnsubscriber implements OnInit{
    APP = inject(AppService)
    private PS = inject(RoutePageService)
    car_routes: RoutePageList = {list: [], isMore: false} 
    choosedCarID: string | null = null
    show_editor = false
    private routes_list_page = 1

    async ngOnInit() {
        this.choosedCarID = this.APP.DATA.getChoosedCarID()
        if (this.choosedCarID) {
            this.PS.getCarRoutes(this.routes_list_page)
        }
        this.PS.route_to_edit$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe( route => {
            if (route) {
                this.show_editor = true
            } else {
                this.show_editor = false
            }
        })
        this.PS.car_routes_list$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe( routes => {
            this.car_routes = routes
        })
    }

    getMoreRoutes() {
        this.routes_list_page++
        this.PS.getCarRoutes(this.routes_list_page)
    }

    editRoute(route: Route) {
        this.PS.route_to_edit$.next(route)
    }

    deleteRoute(route: Route) {
        this.PS.deleteRoute(route)
    }
}

