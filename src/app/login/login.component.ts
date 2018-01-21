import { GlobalState } from './../common/services/state/global.state';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { AuthenticationService } from '../common/services/http/authentication.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public userName:string = "";
  public password:string = "";
  public verificationCode:string = "";

  public isAttemptingLogin:boolean = false;
  public hasLoginFailed:boolean = false;

  constructor(
    private authenticationService:AuthenticationService,
    private router:Router,
    private _state: GlobalState
  ) { }

  ngOnInit() {
  }

  public loginClicked():void{
    //TODO: validate on minimum required characters
    this.logIn(this.userName, this.password);
  }

  public resendClicked():void{
    this.hasLoginFailed = false;
    //TODO: should we implement this some other way?
    this.logIn(this.userName, this.password);
  }

  private logIn(userName:string, password:string):void{
    this.isAttemptingLogin = true;
    this.hasLoginFailed = false;

    this.authenticationService
      .FetchLoginCredentials(userName, password)
      .subscribe(
        (loginResult) => {
          this.authenticationService
            .FetchToken(userName, 5)
            .subscribe(tokenResult => {
              this.handleAuthenticationComplete();
            });
        },
        (error) => {
          this.hasLoginFailed = true;
          this.isAttemptingLogin = false;
        },
        () => {
          this.isAttemptingLogin = false;
        }
      );
  }

  private handleAuthenticationComplete():void{
    this.hasLoginFailed = false;
    this.isAttemptingLogin = false;

    this._state.notifyDataChanged('app.loggedIn', null, true );

    let url:string = "/";

    this.router.navigateByUrl(url);
  }

}
