import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MenuItem } from 'primeng/primeng';
import { SelectItem } from 'primeng/components/common/selectitem';

import { GlobalState } from './common/services/state/global.state';
import { AppComponent } from './app.component';
import { BreadcrumbService } from './breadcrumb.service';
import { Party } from './common/entities/Party';
import { UserService } from './common/services/utility/user.service';
import { AuthorizedCourt } from './common/entities/AuthorizedCourt';
import { ToastService } from './common/services/utility/toast.service';
import { CourtService } from './common/services/http/court.service';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './app.breadcrumb.component.html',
    styleUrls: ['app.breadcrumb.scss']
})
export class AppBreadcrumbComponent implements OnDestroy {

  loggedInUser: Party;

  subscription: Subscription;
  items: MenuItem[];
  selectedCourt:AuthorizedCourt;
  courts: AuthorizedCourt[];

  constructor(
    public breadcrumbService: BreadcrumbService,
    private app: AppComponent,
    public _state:GlobalState,
    public userSvc: UserService,
    public courtSvc: CourtService,
    public toastSvc: ToastService,
    public router: Router
  ) {
    this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
        this.items = response;
    });
  }

  ngOnInit() {
    this._state.subscribe('app.loggedIn', (user) => {
      this.initUser(user);
    });

    this.initUser(this.userSvc.loggedInUser);
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  initUser(user){
    this.loggedInUser =  user;
    this.courts = this.loggedInUser.authorizedCourts;
    this.selectedCourt = this.loggedInUser.authorizedCourts[0];
  }

  courtOnChange(event) {
    console.log('courtOnChange', event);

    // Call FetchCourt with courtOID
    let courtOID = event.value.courtOID;
    this.courtSvc.fetchCourt(courtOID).subscribe( court => {
      this.selectedCourt = this.courts.find( ct => ct.courtOID == courtOID );

      this.toastSvc.showSuccessMessage('Changed to '+ this.selectedCourt.courtName+' '+this.selectedCourt.locationCode);

      this.router.navigate([ '/' ]);
    },
    (error) => {
      console.log(error);
      this.toastSvc.showErrorMessage('There was an error changing courts.')
    },
    () => {
      // final
    })
  }

  sendCourtChanage(courtOID:number) {
    this._state.notifyDataChanged('app.court.change', courtOID, true );
  }


}








