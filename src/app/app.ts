import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { UpperBar } from './UI/components/upper_bar.component';
import { AppService } from './service';
import { AppApperance } from './services/apperance.service';
import { animate, group, query, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    UpperBar
  ],
  providers: [
    AppService,
    AppApperance
  ],
  animations: [
    trigger('routeAnimation', [
      transition('splashScreen => *', [
        group([
          query(":enter", [
            style({ zIndex: 1, opacity: 0 }),
            animate('500ms ease-in-out', style({
              opacity: 1
            }))
          ]),
          query(":leave", [
            style({ zIndex: 2, opacity: 1 }),
            animate('500ms ease-in-out', style({
              opacity: 0
            }))
          ], {optional: true})
        ])
      ]),
    ])
  ],
  template: `
  <upper_bar />
  <div [@routeAnimation]="getRouteAnimationData()">
    <router-outlet />
  </div>
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
