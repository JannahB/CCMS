import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../common/services/http/authentication.service';
import { ToastService } from '../../common/services/utility/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public username:string = "";
  
  public isLoading:boolean = false;

  constructor(
    private authenticationService:AuthenticationService,
    private toastService:ToastService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  public submitClicked():void{
    this.isLoading = true;

    this.authenticationService
      .RequestPasswordReset(this.username)
      .subscribe(result =>{
        this.isLoading = false;
        //This is temporary so I can test.  Would be really bad practice to leave in place
        this.router.navigate([`/new-password/${result.token}`]);
      },
      error =>{
        this.isLoading = false;
        this.toastService
          .showErrorMessage("Reset Password Request Failed");
      });
  }

}
