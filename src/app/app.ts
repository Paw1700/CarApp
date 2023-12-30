import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UpperBar } from './shared/UI/components/upper_bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    UpperBar
  ],
  template: `
  <upper_bar />
  <router-outlet />
  `,
  styles: `` 
})
export class AppComponent {
  
}
