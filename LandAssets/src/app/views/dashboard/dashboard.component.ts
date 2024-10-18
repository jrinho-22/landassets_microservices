import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="Background">
      <app-short-summary></app-short-summary>
      <app-plot-actions></app-plot-actions>
    </div>
  `,
})
export class DashboardComponent {}
