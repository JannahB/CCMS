import { TaskCount } from './common/entities/internal/TaskCount';
import { UserService } from './common/services/utility/user.service';
import {Component, OnInit} from '@angular/core';
import {AppComponent} from './app.component';
import { AuthorizationInterceptor } from './common/interceptors/authorization.interceptor';
import { AuthenticationService } from './common/services/http/authentication.service';
import { Party } from './common/entities/Party';
import { GlobalState } from './common/services/state/global.state';

@Component({
    selector: 'app-topbar',
    styles: [`
      .profile-icon{
        font-size: 36px;
        /*color: #BF2E1A; Brand Red*/
        color: #707070;
      }
      li.profile-item {
        border-left: 1px solid #cccccc;
      }
      .arrow {
        font-size: 1.5em;
      }
    `],
    template: `
        <div class="topbar clearfix" >
            <div class="topbar-left">
                <div class="logo"></div>
            </div>

            <div *ngIf="authSvc.isLoggedIn" class="topbar-right">
                <a id="menu-button" href="#" (click)="app.onMenuButtonClick($event)">
                    <i></i>
                </a>

                <!--
                <a id="rightpanel-menu-button" href="#" (click)="app.onRightPanelButtonClick($event)">
                    <i class="material-icons">more_vert</i>
                </a>
                -->
                <a id="topbar-menu-button" href="#" (click)="app.onTopbarMenuButtonClick($event)">
                    <i class="material-icons">more_vert</i>
                </a>

                <ul class="topbar-items animated fadeInDown" [ngClass]="{'topbar-items-visible': app.topbarMenuActive}">
                    <li #profile class="profile-item" *ngIf="app.profileMode==='top'||app.isHorizontal()"
                        [ngClass]="{'active-top-menu':app.activeTopbarItem === profile}">

                        <button mat-button (click)="app.onTopbarItemClick($event,profile)">
                          <i class="material-icons profile-icon">account_circle</i>
                          <span class="">{{loggedInUser?.firstName}} {{loggedInUser?.lastName}}</span>
                          <i class="material-icons profile-icon arrow">keyboard_arrow_down</i>
                        </button>

                        <!--
                        <a href="#" (click)="app.onTopbarItemClick($event,profile)">
                          <i class="material-icons profile-icon">account_circle</i>
                          <!-- <img class="profile-image" src="assets/layout/images/avatar.png" />
                          <span class="">{{loggedInUser?.firstName}} {{loggedInUser?.lastName}}</span>
                        </a>
                        -->

                        <ul class="ultima-menu animated fadeInDown">

                          <li role="menuitem">
                            <a href="#">
                                <i class="material-icons">person</i>
                                <span>{{loggedInUser?.firstName}} {{loggedInUser?.lastName}} </span>
                              </a>
                            </li>
                            <li role="menuitem">
                                <a href="#">
                                    <i class="material-icons">palette</i>
                                    <span>Themes</span>
                                </a>

                                <ul class="ultima-menu">
                                    <li role="menuitem" (click)="sendThemeChange('tt')">
                                        <a href="#">
                                            <i class="material-icons">brush</i>
                                            <span>Blue Theme</span>
                                        </a>
                                    </li>
                                    <li role="menuitem" (click)="sendThemeChange('tt2')">
                                        <a href="#">
                                            <i class="material-icons">brush</i>
                                            <span>Red Theme</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <!--
                            <li role="menuitem">
                                <a href="#">
                                    <i class="material-icons">settings_applications</i>
                                    <span>Settings</span>
                                </a>
                            </li> -->
                            <li role="menuitem">
                                <a routerLink="/login" (click)="logout()">
                                    <i class="material-icons">power_settings_new</i>
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <!--
                    <li #messages [ngClass]="{'active-top-menu':app.activeTopbarItem === messages}">
                        <a href="#" (click)="app.onTopbarItemClick($event,messages)">
                            <i class="topbar-icon material-icons animated swing">message</i>
                            <span class="topbar-badge animated rubberBand">5</span>
                            <span class="topbar-item-name">Messages</span>
                        </a>
                        <ul class="ultima-menu animated fadeInDown">
                            <li role="menuitem">
                                <a href="#" class="topbar-message">
                                    <p class="mb-0">Important Message </p>
                                    <p class="muted-label mt-0">Dec 31, 2017</p>
                                    <span class="muted-label">A message for all to see here. Very importantant announcement about an upcoming case. Read about the change here... </span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" class="topbar-message">
                                    <p class="mb-0">Happy New Year </p>
                                    <p class="muted-label mt-0">Jan 1, 2017</p>
                                    <span class="muted-label">Happy new year to all our employees. Very importantant announcement about an upcoming case. Read about the change here... </span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" class="topbar-message">
                                    <p class="mb-0">Procedure Change </p>
                                    <p class="muted-label mt-0">Jan 2, 2017</p>
                                    <span class="muted-label">We've made a change to the following procedure... </span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" class="topbar-message">
                                    <p class="mb-0">Message </p>
                                    <p class="muted-label mt-0">Jan 3, 2017</p>
                                    <span class="muted-label">A message for all to see here. Very importantant announcement about an upcoming case. Read about the change here... </span>
                                </a>
                            </li>

                        </ul>
                    </li> -->
                    <li #notifications [ngClass]="{'active-top-menu':app.activeTopbarItem === notifications}">
                        <a href="#" (click)="app.onRightPanelButtonClick($event)">
                            <i class="topbar-icon material-icons">timer</i>
                            <span class="topbar-badge animated rubberBand">{{userTaskCount}}</span>
                            <span class="topbar-item-name">Tasks</span>
                        </a>

                    </li>
                    <!--
                    <li #search class="search-item" [ngClass]="{'active-top-menu':app.activeTopbarItem === search}"
                        (click)="app.onTopbarItemClick($event,search)">
                        <span class="md-inputfield">
                            <input type="text" pInputText>
                            <label>Search</label>
                            <i class="topbar-icon material-icons">search</i>
                        </span>
                    </li>
                    -->
                </ul>
            </div>
        </div>
    `
})
export class AppTopbarComponent {

  loggedInUser: Party;
  userTaskCount: number;

    constructor(
      public app: AppComponent,
      public _state:GlobalState,
      public authSvc: AuthenticationService,
      public userSvc: UserService
    ) { }

    ngOnInit() {

      this._state.subscribe('app.loggedIn', (user) => {
        this.loggedInUser = user;
      });

      this._state.subscribe('userTasks.count', (counts:TaskCount) => {
        this.userTaskCount = counts.totalTaskCount;
      })

      this.loggedInUser = this.userSvc.loggedInUser;
    }

    sendThemeChange(theme:string) {
        this._state.notifyDataChanged('theme.change', theme, true );
    }

    public logout():void {
      this.userSvc.loggedInUser = null;
      AuthorizationInterceptor.authToken = null;
      this._state.notifyDataChanged('app.loggedOut', null, true );
    }

}
