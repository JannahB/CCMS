import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Party } from '../../common/entities/Party';
import { Message } from 'primeng/components/common/api';
import { UserService } from '../../common/services/utility/user.service';
import { DateUtils } from '../../common/utils/date-utils';
import { PartyService } from '../../common/services/http/party.service';
import { Permission } from '../../common/entities/Permission';


@Component({
  selector: 'app-party-search',
  templateUrl: './party-search.component.html',
  styleUrls: ['./party-search.component.scss']
})
export class PartySearchComponent implements OnInit {

  partyNameText: string = "";
  partyResults: Party[];
  selectedParty: Party;
  showRecordsFoundMessage: boolean = false;
  recordsFoundMessage: string;
  isSearching = false;
  page: number = 0;
  size: number = 10;
  public Permission: any = Permission;


  constructor(
    private partyService: PartyService,
    private router: Router,
    private userSvc: UserService
  ) { }

  ngOnInit() {
  }

  public onSearch(page: number): void {
    this.showRecordsFoundMessage = false;
    this.isSearching = true;
    let obj = { "partyName": this.partyNameText, "page": page, "size": this.size };
    this.page = page;
    this.partyService
      .fetchAny(obj)
      .subscribe((result) => {
        this.partyResults = result;
        this.showNumberOfRecordsFound(result.length);
        this.isSearching = false;
        this.setPartiesAge();

      });
  }

  hasPermission(pm) {
    return this.userSvc.hasPermission(pm);
  }

  setPartiesAge() {
    if (this.partyResults.length > 0) {
      this.partyResults.map(p => {
        p.age = DateUtils.calculateAge(p.dob);
      })
    }
  }

  showNumberOfRecordsFound(num) {
    let text = num == 1 ? ' record found' : ' records found';
    this.showRecordsFoundMessage = true;
    this.recordsFoundMessage = num + text;
  }

  partyOnRowSelect(event) {
    console.log(event)
    let partyId = event.data.partyOID;

    this.router.navigate(['party-detail', partyId]);
  }

  onReset() {
    this.showRecordsFoundMessage = false;
    this.partyNameText = '';
  }

  onNewParty() {
    this.router.navigate(['party-detail', 0]);
  }

}
