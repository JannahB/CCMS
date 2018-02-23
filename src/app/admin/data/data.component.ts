import { BreadcrumbService } from './../../breadcrumb.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AdminDataService } from '../../common/services/http/admin-data.service';
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
export class DataComponent implements OnInit {

  refDataTables: any[];
  routeSubscription: Subscription;
  urlSubscription: Subscription;
  selectedTableId: number;
  selectedTable: any;

  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
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
    let url = this.activatedRoute.url;
    console.log('url', url);

    this.urlSubscription = this.activatedRoute.firstChild.url.subscribe(url => {
      let fragment = url[0].path;
      if(fragment)
        this.setTableByUrlFragment(fragment);
    });


  }

  ngOnDestroy() {
    if(this.urlSubscription) this.urlSubscription.unsubscribe();
  }


  getRefData() {

    this.refDataTables = [
      { value: 1, route: 'casetypes', label: "Case Type" },
      // { value: 2, route: 'casephases', label: "Case Phase Type"},
      { value: 3, route: 'casestatuses', label: "Case Status Type" },
      // { value: 4, route: 'case', label: "Case Party Role Type" },
      // { value: 5, route: 'case', label: "Party Identifier Type" },
      // { value: 6, route: 'case', label: "ICCS Code" },
      // { value: 7, route: 'case', label: "Event Type" },
      // { value: 8, route: 'case', label: "Hearing Type" },
      { value: 9, route: 'courtlocations', label: "Court Location" },
    ];
  }

  refTableSelected(event) {
    this.selectedTableId = event.value;
    this.setSelectedTable(this.selectedTableId);
    this.navigateToTable(this.selectedTable['route']);
  }

  setSelectedTable(id){
    this.selectedTable = this.refDataTables.find((type) => type.value ==  id);
  }

  navigateToTable(route) {
    this.router.navigate(['/admin/data/'+ route])
  }

  setTableByUrlFragment(fragment) {
    this.selectedTable = this.refDataTables.find((type) => type.route ==  fragment);
    this.selectedTableId = this.selectedTable['value'];
  }


  refreshLookups() {
    this.adminSvc.refreshLookupTables().subscribe( result => {
      this.toastSvc.showSuccessMessage('Lookup Tables Refreshed');
    },
    (error) => {
      console.error(error);
      this.toastSvc.showErrorMessage('There was an error refreshing lookup tables.')
    },
    () => {
      // finally
    })
  }

}
