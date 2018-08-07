import { CourtCount } from './../../common/entities/CourtCount';
import { CaseCountsService } from './../../common/services/http/case-counts.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Party } from '../../common/entities/Party';
import { Message } from 'primeng/components/common/api';
import { UserService } from './../../common/services/utility/user.service';
import { DateUtils } from '../../common/utils/date-utils';
import { PartyService } from '../../common/services/http/party.service';
import { Permission } from '../../common/entities/Permission';


@Component({
  selector: 'app-case-counts',
  templateUrl: './case-counts.component.html',
  styleUrls: ['./case-counts.component.scss']
})
export class CaseCountsComponent implements OnInit {

  selectedCourt: any;
  selectedYear: number;
  showRecordsFoundMessage: boolean = false;
  recordsFoundMessage: string;
  caseCounts: any[];
  courtCounts: CourtCount[];

  constructor(
    private caseCountSvc: CaseCountsService,
    private router: Router,
    private userSvc: UserService
  ) { }

  ngOnInit() {

    this.caseCounts = [
      {
        name: "theCourtName", id: 5, counts: {
          casesYear: 15,
          casesClosedYear: 10,
          casesTwelve: 8,
          casesActive: 5,
          casesInactive: 53
        }
      }
    ]

    this.selectedYear = 2018;
    this.getCounts();
  }

  getCounts(): void {
    this.showRecordsFoundMessage = false;
    this.caseCountSvc.getCaseCountsByYear()
      .subscribe((result) => {
        this.courtCounts = result;
        this.showNumberOfRecordsFound(result.length);
      });
  }

  onYearChange(event): void {
    console.log(event)
  }

  showNumberOfRecordsFound(num) {
    let text = num == 1 ? ' record found' : ' records found';
    this.showRecordsFoundMessage = true;
    this.recordsFoundMessage = num + text;
  }

  onRowSelect(event) {
    console.log(event)
    // this.router.navigate(['party-detail', partyId]);
  }



}
