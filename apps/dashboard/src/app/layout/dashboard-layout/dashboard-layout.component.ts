import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
    selector: 'app-dashboard-layout',
    standalone: true,
    imports: [RouterOutlet, SidebarComponent],
    template: `
    <div class="flex h-screen bg-gray-50">
      <app-sidebar></app-sidebar>
      <main class="flex-1 overflow-y-auto p-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class DashboardLayoutComponent { }
