import { AuthenticationService } from './common/services/http/authentication.service';
import { GlobalState } from './common/services/state/global.state';
import {Component, Input, OnInit} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {MenuItem} from 'primeng/primeng';
import {AppComponent} from './app.component';

@Component({
    selector: 'app-menu',
    template: `
    <div *ngIf="authSvc.isLoggedIn">
        <ul app-submenu [item]="model" root="true" class="ultima-menu ultima-main-menu clearfix" [reset]="reset" visible="true"></ul>
    </div>
    `
})
export class AppMenuComponent implements OnInit {

    @Input() reset: boolean;

    model: any[];

    constructor(
      public app: AppComponent,
      public _state:GlobalState,
      public authSvc: AuthenticationService
    ) {}

    ngOnInit() {

        this._state.subscribe('theme.change', (theme) => {
            this.changeTheme(theme);
        });

        this.model = [
          {label: 'Dashboard', icon: 'dashboard', routerLink: ['/']},
          {label: 'Case', icon: 'gavel',
            items: [
                {label:'Search Case', icon:'search', routerLink: ['/case-search']},
                {label:'New Case', icon:'gavel', routerLink: ['/case-detail/0']},
            ]},
          {label: 'Party', icon: 'folder_shared',
            items: [
                {label:'Search Party', icon:'search', routerLink: ['/party-search']},
                {label:'New Party', icon:'folder_shared', routerLink: ['/party-detail/0']},
            ]},
          {label: 'Admin', icon: 'security',
            items: [
              {label:'Table Data', icon:'chrome_reader_mode', items: [
                {label:'Case Types', icon:'chrome_reader_mode', routerLink: ['/admin/data/casetypes']},
                {label:'Case Phases', icon:'chrome_reader_mode', routerLink: ['/admin/data/casephases']},
                {label:'Case Statuses', icon:'chrome_reader_mode', routerLink: ['/admin/data/casestatuses']},
                {label:'Court Locations', icon:'chrome_reader_mode', routerLink: ['/admin/data/courtlocations']},
                {label:'Case Party Roles', icon:'chrome_reader_mode', routerLink: ['/admin/data/casepartyroles']},
                {label:'Event Types', icon:'chrome_reader_mode', routerLink: ['/admin/data/eventtypes']},


              ]},
              // {label:'Table Data', icon:'chrome_reader_mode', routerLink: ['/admin-data']},
              {label:'Event Workflow', icon:'rotate_90_degrees_ccw', routerLink: ['/admin/workflow']},
              {label:'User Maintenance', icon:'account_box', routerLink: ['/admin/users']},
            ]},


            // {
            //     label: 'Themes', icon: 'palette', badge: '2',
            //     items: [
            //         {label: 'TT Blue', icon: 'brush', command: (event) => {this.changeTheme('tt'); }},
            //         {label: 'TT Red', icon: 'brush', command: (event) => {this.changeTheme('tt2'); }},
            //         {label: 'Login Page', icon: 'verified_user', url: 'assets/pages/login.html', target: '_blank'},
            //         {label: 'Dark Menu', icon: 'label',  command: () => this.app.darkMenu = true},
            //     ]
            // },

        ];
    }

    changeTheme(theme) {
        const themeLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('theme-css');
        const layoutLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('layout-css');

        themeLink.href = 'assets/theme/theme-' + theme + '.css';
        layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';
    }
}

@Component({
  /* tslint:disable:component-selector */
    selector: '[app-submenu]',
  /* tslint:enable:component-selector */
    template: `
        <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
            <li [ngClass]="{'active-menuitem': isActive(i)}" [class]="child.badgeStyleClass" *ngIf="child.visible === false ? false : true">
                <a [href]="child.url||'#'"
                        (click)="itemClick($event,child,i)"
                        (mouseenter)="onMouseEnter(i)"
                        class="ripplelink"
                        *ngIf="!child.routerLink"
                        [attr.tabindex]="!visible ? '-1' : null"
                        [attr.target]="child.target">
                    <i *ngIf="child.icon" class="material-icons">{{child.icon}}</i>
                    <span>{{child.label}}</span>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                    <i class="material-icons submenu-icon" *ngIf="child.items">keyboard_arrow_down</i>
                </a>

                <a (click)="itemClick($event,child,i)"
                        (mouseenter)="onMouseEnter(i)"
                        class="ripplelink"
                        *ngIf="child.routerLink"
                        [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink"
                        [routerLinkActiveOptions]="{exact: true}"
                        [attr.tabindex]="!visible ? '-1' : null"
                        [attr.target]="child.target">
                    <i *ngIf="child.icon" class="material-icons">{{child.icon}}</i>
                    <span>{{child.label}}</span>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                    <i class="material-icons submenu-icon" *ngIf="child.items">keyboard_arrow_down</i>
                </a>
                <div class="layout-menu-tooltip">
                    <div class="layout-menu-tooltip-arrow"></div>
                    <div class="layout-menu-tooltip-text">{{child.label}}</div>
                </div>
                <ul app-submenu [item]="child" *ngIf="child.items" [visible]="isActive(i)" [reset]="reset"
                    [@children]="(app.isSlim()||app.isHorizontal())&&root ? isActive(i) ?
                    'visible' : 'hidden' : isActive(i) ? 'visibleAnimated' : 'hiddenAnimated'"></ul>
            </li>
        </ng-template>
    `,
    animations: [
        trigger('children', [
            state('hiddenAnimated', style({
                height: '0px'
            })),
            state('visibleAnimated', style({
                height: '*'
            })),
            state('visible', style({
                height: '*'
            })),
            state('hidden', style({
                height: '0px'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppSubMenuComponent {

    @Input() item: MenuItem;

    @Input() root: boolean;

    @Input() visible: boolean;

    _reset: boolean;

    activeIndex: number;

    constructor(public app: AppComponent) {}

    itemClick(event: Event, item: MenuItem, index: number) {
        if (this.root) {
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }

        // avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        // activate current item and deactivate active sibling if any
        this.activeIndex = (this.activeIndex === index) ? null : index;

        // execute command
        if (item.command) {
            item.command({originalEvent: event, item: item});
        }

        // prevent hash change
        if (item.items || (!item.url && !item.routerLink)) {
            event.preventDefault();
        }

        // hide menu
        if (!item.items) {
            if (this.app.isHorizontal() || this.app.isSlim()) {
                this.app.resetMenu = true; } else {
                this.app.resetMenu = false; }

            this.app.overlayMenuActive = false;
            this.app.staticMenuMobileActive = false;
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }
    }

    onMouseEnter(index: number) {
        if (this.root && this.app.menuHoverActive && (this.app.isHorizontal() || this.app.isSlim())) {
            this.activeIndex = index;
        }
    }

    isActive(index: number): boolean {
        return this.activeIndex === index;
    }

    @Input() get reset(): boolean {
        return this._reset;
    }

    set reset(val: boolean) {
        this._reset = val;

        if (this._reset && (this.app.isHorizontal() || this.app.isSlim())) {
            this.activeIndex = null;
        }
    }
}
