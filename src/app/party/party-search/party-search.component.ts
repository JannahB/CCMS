import { Component, OnInit } from '@angular/core';
import { PartyService } from '../../common/services/http/party.service';
import { Party } from '../../common/entities/Party';
import { Router } from '@angular/router';

import {Message} from 'primeng/components/common/api';


@Component({
  selector: 'app-party-search',
  templateUrl: './party-search.component.html',
  styleUrls: ['./party-search.component.scss']
})
export class PartySearchComponent implements OnInit {

  partyNameText:string = "";
  partyResults: Party[];
  selectedParty: Party;
  showRecordsFoundMessage: boolean = false;
  recordsFoundMessage: string;


  constructor(
    private partyService:PartyService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  public onSearch():void{
    this.showRecordsFoundMessage = false;
    let obj = { "partyName": this.partyNameText };
    this.partyService
      .fetchAny(obj)
      .subscribe((result) => {
        this.partyResults = result;
        this.showNumberOfRecordsFound(result.length);
      });
  }

  showNumberOfRecordsFound(num){
    let text = num == 1 ? ' record found' : ' records found';
    this.showRecordsFoundMessage = true;
    this.recordsFoundMessage = num + text;
  }

  partyOnRowSelect(event) {
    console.log(event)
    let partyId = event.data.partyOID;

    this.router.navigate(['party-detail', partyId ]);
  }

  onReset(){
    this.showRecordsFoundMessage = false;
    this.partyNameText = '';
  }

  onNewParty(){
    this.router.navigate(['party-detail', 0 ]);
  }

}
