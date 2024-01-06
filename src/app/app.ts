import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { AppService } from './service';
import { AppApperance } from './services/apperance.service';
import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { AppData } from './services/data/_main.service';
import { CarBrandService } from './services/data/car_brand.service';
import { AppValidator } from './services/validator.service';
import { CarService } from './services/data/car.service';
import { DatabaseManager } from './util/db.driver';
import { RouteService } from './services/data/routes.service';
import { AppState } from './services/state.service';
import { NavBar } from './UI/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavBar
  ],
  providers: [
    AppService,
    AppApperance,
    AppData,
    AppValidator,
    CarBrandService,
    CarService,
    DatabaseManager,
    RouteService,
    AppState
  ],
  animations: [
    trigger('routeAnimation', [
      transition('splashScreen => *, startConfig => home', [
        group([
          query(":enter", [
            style({ zIndex: 1, opacity: 0 }),
            animate('350ms ease-in-out', style({
              opacity: 1
            }))
          ]),
          query(":leave", [
            style({ zIndex: 2, opacity: 1 }),
            animate('350ms ease-in-out', style({
              opacity: 0
            }))
          ], { optional: true })
        ])
      ]),

      //* SLIDE TO LEFT
      transition("settings => aboutApp, settings => brandList, brandList => createBrand, carsList => carCreate", [
        group([
          query(":enter", [
            style({ zIndex: 2, position: 'absolute', left: '100vw', top: 0 }),
            animate('350ms ease-out', style({
              left: 0
            }))
          ], { optional: true }),
          query(":leave", [
            style({ zIndex: 1, position: 'absolute', left: 0, top: 0 }),
            animate('350ms ease-in', style({
              
            }))
          ], { optional: true })
        ])
      ]),

      //* SLIDE RIGHT
      transition("aboutApp => settings, brandList => settings, createBrand => brandList, carCreate => carsList", [
        group([
          query(":enter", [
            style({ zIndex: 1, position: 'absolute', left: 0, top: 0 }),
            animate('350ms ease-out', style({
            }))
          ], { optional: true }),
          query(":leave", [
            style({ zIndex: 2, position: 'absolute', left: 0, top: 0 }),
            animate('350ms ease-in', style({
              left: '100vw'
            }))
          ], { optional: true })
        ])
      ])
    ])
  ],
  template: `
  <div [@routeAnimation]="getRouteAnimationData()">
    <router-outlet />
  </div>
  <navbar />
  `,
  styles: ``
})
export class AppComponent {
  constructor(private APP: AppService, private contexts: ChildrenOutletContexts) {
    this.APP.startApp()
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animState'];
  }
}
