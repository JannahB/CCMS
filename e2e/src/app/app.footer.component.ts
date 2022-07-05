import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-footer',
  styles: [
    `
    .footer { font-size: 12px; }
    .footer .footer-text-left { margin-right: 5px; }
    .footer .ui-icon-copyright { margin: 3px; }
    @media (min-width: 1025px) {
      .footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        margin-bottom: 0;
        padding-bottom: 0 !important;
      }
    }
    `
  ],
  template: `
    <div class="footer">
      <div class="card clearfix mb-0">
        <span class="">
          <span class="material-icons ui-icon-copyright footer-text-left"></span>
          <span class="footer-text-left"> Copyright 2018</span>
          <span class="footer-text-left"> CCMS T&amp;T</span>
        </span>
        <span class="footer-text-right">
          ui: v{{version}}
        </span>
      </div>
    </div>
    `
})
export class AppFooterComponent {

  public version: string = environment.VERSION;

}
