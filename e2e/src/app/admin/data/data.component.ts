import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AdminDataService } from '../../common/services/http/admin-data.service';
import { BreadcrumbService } from '../../breadcrumb.service';
import { ToastService } from '../../common/services/utility/toast.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styles: [
    `
    .card h2 {
      font-weight: 300;
      text-transform: uppercase;
    }

    `
  ]
})
export class DataComponent implements OnInit, OnDestroy {

  refDataTables: any[];
  routeSubscription: Subscription;
  urlSubscription: Subscription;
  selectedTableId: number;
  selectedTable: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadCrumbSvc: BreadcrumbService,
    private adminSvc: AdminDataService,
    private toastSvc: ToastService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Data Table Maintenance', routerLink: ['/admin/data'] }
    ]);
  }

  ngOnInit() {

    this.getRefData();
    const url = this.activatedRoute.url;
    console.log('url', url);

    this.urlSubscription = this.activatedRoute.firstChild.url.subscribe(url => {
      const fragment = url[0].path;
      if (fragment) {
        this.setTableByUrlFragment(fragment);
      }
    });


  }

  ngOnDestroy() {
    if (this.urlSubscription) {
      this.urlSubscription.unsubscribe();
    }
  }


  getRefData() {

    this.refDataTables = [
      { value: 1, route: 'casetypes', label: "Case Type" },
      { value: 2, route: 'casephases', label: "Case Phase Type" },
      { value: 3, route: 'casestatuses', label: "Case Status Type" },
      { value: 4, route: 'casepartyroles', label: "Case Party Role Type" },
      { value: 5, route: 'eventtypes', label: "Event Type" },
      { value: 6, route: 'iccscodes', label: "ICCS Code" },
      { value: 7, route: 'hearingtypes', label: "Hearing Type" },
      { value: 8, route: 'courtlocations', label: "Court Location" },
      { value: 9, route: 'staffroles', label: "Staff Roles" },
      { value: 10, route: 'courts', label: "Courts" },
      { value: 11, route: 'rolepermissions', label: "Role Permissions" },
      { value: 12, route: 'staffpools', label: 'Staff Pool' },
      { value: 13, route: 'tasktypes', label: 'Task Types' },
      { value: 14, route: 'personalidtypes', label: 'Personal ID Types' },
    ];
  }

  refTableSelected(event) {
    this.selectedTableId = event.value;
    this.setSelectedTable(this.selectedTableId);
    this.navigateToTable(this.selectedTable['route']);
  }

  setSelectedTable(id) {
    this.selectedTable = this.refDataTables.find((type) => type.value === id);
  }

  navigateToTable(route) {
    this.router.navigate(['/admin/data/' + route]);
  }

  setTableByUrlFragment(fragment) {
    this.selectedTable = this.refDataTables.find((type) => type.route === fragment);
    this.selectedTableId = this.selectedTable['value'];
  }


  refreshLookups() {
    this.adminSvc.refreshLookupTables().subscribe(result => {
      this.toastSvc.showSuccessMessage('Lookup Tables Refreshed');
    },
      (error) => {
        console.error(error);
        this.toastSvc.showErrorMessage('There was an error refreshing lookup tables.');
      },
      () => {
        // finally
      });
  }

}
