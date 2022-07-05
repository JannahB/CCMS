import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../common/services/http/authentication.service';
import { ToastService } from '../../common/services/utility/toast.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public username:string = "";
  
  public isLoading:boolean = false;

  public hasPasswordRequestBeenSent:boolean = false;

  constructor(
    private authenticationService:AuthenticationService,
    private toastService:ToastService,
    private router:Router,
    private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute
      .queryParams
      .subscribe(params => {
        if(params.token){
          this.router.navigate([`/new-password/${params.token}`]);
        }
      });
  }

  public submitClicked():void{
    this.isLoading = true;

    this.authenticationService
      .RequestPasswordReset(this.username)
      .subscribe(result =>{
        this.isLoading = false;
        
        this.hasPasswordRequestBeenSent = true;
      },
      error =>{
        this.isLoading = false;
        this.toastService
          .showErrorMessage("Reset Password Request Failed");
      });
  }

}
