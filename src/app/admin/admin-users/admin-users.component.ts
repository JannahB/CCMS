import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../breadcrumb.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  constructor( private breadCrumbSvc:BreadcrumbService) {
    this.breadCrumbSvc.setItems([
      { label: 'Admin User Management', routerLink: ['/admin-users'] }
    ]);
  }

  ngOnInit() {
  }

}
