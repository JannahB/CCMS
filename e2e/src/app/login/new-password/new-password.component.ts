import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../common/services/http/authentication.service';
import { ToastService } from '../../common/services/utility/toast.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  public isLoading:boolean = false;

  public username:string = "";
  public password:string = "";
  public confirmPassword:string = "";

  private token:string = "";

  constructor(
    private authenticationService:AuthenticationService,
    private toastService:ToastService,
    private activatedRoute:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit() {
    this.activatedRoute
      .params
      .subscribe(result => {
        let token:string = result["token"];

        if(!token){
          this.toastService
            .showErrorMessage("No token was supplied");

          return;
        }

        this.token = token;
      });
  }

  public submitClicked():void{
    if(this.password != this.confirmPassword){
      this.toastService
        .showErrorMessage("Password and Confirmation must match");

      return;
    }

    this.isLoading = true;

    this.authenticationService
      .ResetPassword(this.username, this.password, this.token)
      .subscribe(result => {
        this.isLoading = false;
        this.toastService
          .showSuccessMessage("Password successfully changed");

        this.router
          .navigate(["/login"]);
      },
      error => {
        this.isLoading = false;
        this.toastService
          .showErrorMessage("An error occurred while changing password");
      }
    );
  }

}
