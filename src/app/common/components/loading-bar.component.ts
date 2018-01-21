import { Component, Input } from '@angular/core';

@Component({
    selector: 'loading-bar',
    template: `
      <div class="outer-bg" *ngIf="visible">
        <div class="container">
          <div class="load-bar">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
          <div class="msg">{{message}}</div>
        </div>
      </div>
    `,
    styles: [
      `
      .msg{
        color: #085981;
        font-size: 0.9em;
        margin-top: 10px;
      }
      .outer-bg {
        background-color: rgba(125, 174, 212, 0.35);
        width: 100%;
        min-height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
      }
      .container {
        width: 100%;
        margin: 0 auto;
        text-align: center;
        padding-top: 0px;
        padding-bottom: 10px;
        background-color: rgba(255,255,255, 0.75);
        top: 2px;
        position: relative;
      }
      .load-bar {
        position: relative;
        margin-top: 100px;
        width: 100%;
        height: 3px;
        background-color: #ffffff;
      }
      .bar {
        content: "";
        display: inline;
        position: absolute;
        width: 0;
        height: 100%;
        left: 50%;
        text-align: center;
      }

      /*
      #a7a596  tan
      #0e7c5b  teal
      #66ACE2  blue
      1A87BF   blue
      #25BF6B  bright green
      */
      .bar:nth-child(1) {
        background-color: #1A87BF;
        animation: barloading 6s linear infinite;
      }
      .bar:nth-child(2) {
        background-color: #25bf6b;
        animation: barloading 6s linear 2s infinite;
      }
      .bar:nth-child(3) {
        background-color: #a2eec4;
        animation: barloading 6s linear 4s infinite;
      }

      @keyframes barloading {
        from {left: 50%; width: 0;z-index:100;}
        33.3333% {left: 0; width: 100%;z-index: 10;}
        to {left: 0; width: 100%;}
      }

      `
    ]
})
export class LoadingBarComponent {
    @Input() visible = true;
    @Input() message = 'loading...';
}
