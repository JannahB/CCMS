import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-footer',
  styles: [
    `
    .footer { font-size: 12px; }
    .footer .footer-text-left { margin-right: 5px; }
    .footer .ui-icon-copyright { margin: 3px; }
    `
  ],
  template: `
    <div class="footer">
      <div class="card clearfix">
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
