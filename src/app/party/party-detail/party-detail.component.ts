import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import { SelectItem } from 'primeng/primeng';

import { GenericTypesService } from './../../common/services/http/generic.types.service';
import { PhoneNumber } from './../../common/entities/PhoneNumber';
import { Address } from './../../common/entities/Address';
import { PartyService } from './../../common/services/http/party.service';
import { DropdownDataTransformService } from './../../common/services/utility/dropdown-data-transform.service';
import { BreadcrumbService } from '../../breadcrumb.service';
import { DateConverter } from './../../common/utils/date-converter';
import { Identifier } from './../../common/entities/Identifier';
import { IdentifierService } from './../../common/services/http/identifier.service';
import { Language } from '../../common/entities/Language';
import { LanguageService } from './../../common/services/http/language.service';
import { Party } from './../../common/entities/Party';
import { ToastService } from '../../common/services/utility/toast.service';
import { Email } from '../../common/entities/Email';
import { CountriesService } from '../../common/services/http/countries.service';


@Component({
  selector: 'app-party-detail',
  templateUrl: './party-detail.component.html',
  styleUrls: ['./party-detail.component.scss']
})
export class PartyDetailComponent implements OnInit, OnDestroy {

  lockApiCalls:boolean = false;

  addressTypes:SelectItem[];
  selectedAddress: Address;
  selectedAddressCopy: Address;
  countries:SelectItem[];
  countriesSubscription: Subscription;
  emailTypes:SelectItem[];
  selectedEmail:Email;
  selectedEmailCopy: Email;
  filteredLanguages:string[];
  genderTypes:any[];
  genericSubsciption: Subscription;
  selectedIdentifier:Identifier;
  selectedIdentifierCopy: Identifier;
  identifierTypes:Identifier[];
  identifierTypeOptions: SelectItem[];
  identifierSubscription: Subscription;
  languages:Language[];
  languageSubscription: Subscription;
  party:Party;
  partySubscription: Subscription;
  phoneTypes:SelectItem[];
  selectedPhone: PhoneNumber;
  selectedPhoneCopy: PhoneNumber;

  newEmailMode: boolean = false;
  newIdentifierMode: boolean = false;
  newPhoneMode: boolean = false;
  newAddressMode: boolean = false;

  showDeleteIdentifierModal: boolean = false;
  showDeleteEmailModal: boolean = false;
  showDeletePhoneModal: boolean = false;
  showDeleteAddressModal: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadCrumbSvc:BreadcrumbService,
    private toastSvc:ToastService,
    private languageSvc: LanguageService,
    private identifierSvc: IdentifierService,
    private dropdownSvc: DropdownDataTransformService,
    private partySvc: PartyService,
    private genericTypeSvc: GenericTypesService,
    private countriesSvc: CountriesService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Party Detail', routerLink: ['/party-detail'] }
    ]);
  }

  ngOnInit() {

    let params:any = this.activatedRoute.params;
    let partyId:string = params.value.partyId;

    if(partyId == "0" || partyId == null) {
      // TODO: Create New Party with empty properties;
      // new'ing doesn't bring properties w/o constructor on entity!?
      this.party = new Party();
    } else {
      this.partySubscription = this.partySvc.fetchOne(partyId).subscribe (party => {
        this.party = party;
      });

    }

    /// MOCK SUPPORT
    /*
    this.partySubscription = this.partySvc.getOneMock(partyId).subscribe (party => {
      this.party = party;
    })

    this.partySubscription = this.partySvc.getMock().subscribe( parties => {
      // TODO: Change this to support sinble party when wired to API
      this.party = parties[1];
    });
    */

    this.languageSubscription = this.languageSvc.getMock().subscribe(langs => {
      this.languages = langs;
      // this.projectCopy = { ...this.project }
      console.log('languages', langs);
    });

    this.identifierSubscription = this.identifierSvc.getMock().subscribe(items => {
      this.identifierTypes = items;
      this.identifierTypeOptions = this.dropdownSvc.transformSameLabelAndValue(this.identifierTypes, 'name');
    });

    this.genericSubsciption = this.genericTypeSvc.getMock().subscribe( types => {
      let gTypes = this.dropdownSvc.transformSameLabelAndValue(types, 'name');
      this.emailTypes = gTypes;
      this.addressTypes = gTypes;
      this.phoneTypes = gTypes;
    });

    this.countriesSubscription = this.countriesSvc.getMock().subscribe( countries => {
      this.countries = this.dropdownSvc.transformSameLabelAndValue(countries, 'name');
    })

    this.buildRefData();

  }

  ngOnDestroy() {
    if (this.languageSubscription) this.languageSubscription.unsubscribe();
    if(this.identifierSubscription) this.identifierSubscription.unsubscribe();
    if(this.partySubscription) this.partySubscription.unsubscribe();
    if(this.genericSubsciption) this.genericSubsciption.unsubscribe();
    if(this.countriesSubscription) this.countriesSubscription.unsubscribe();
  }


  /* -------------------
    General Details Methods
    --------------------  */
  calculateAge(dob) {
    if(!dob) return;
    return moment().diff(dob, 'years');
  }

  genderTypesOnChange(event) {
    this.party.sex = event.value;
    // Persist party object
    this.toastSvc.showSuccessMessage('Party Saved!')
  }

  getLangsToFilter(event) {
    let query = event.query;
    // this.languageService.get().then(langs => {
    //     this.filteredLanguages = this.filterLangs(query, langs);
    // });
    this.filteredLanguages = this.filterLangs(query, this.languages);
  }

  filterLangs( query, languages: any[] ):any[] {
    let filtered : any[] = [];
    for(let i = 0; i < languages.length; i++) {
        let lang = languages[i];
        if(lang.languageName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(lang);
        }
    }
    return filtered;
  }

  /* -------------------
      General Details Party Methods
    --------------------  */
  savePartyDetails() {
    // TODO: Save Party functionality
  }

  /* -------------------
      Identifier Methods
    --------------------  */
  newIdentifier() {
    this.newIdentifierMode = true;
    this.selectedIdentifier = new Identifier();
    this.party.identifiers.push(this.selectedIdentifier);
    this.party.identifiers = this.party.identifiers.slice();
  }

  identifierOnRowSelect(event){
    this.selectedIdentifierCopy = { ...this.selectedIdentifier }
    this.selectedIdentifier = event.data;
  }

  identifierTypeOnChange(event) {
    this.selectedIdentifier.identifierType = event.value;
  }

  requestDeleteIdentifier() {
    this.showDeleteIdentifierModal = true;
  }

  deleteIdentifier() {
    this.showDeleteIdentifierModal = false;
    // TODO: Process delete
  }

  cancelIdentifierEdit() {
    this.newIdentifierMode = false;
    if(!this.selectedIdentifier.partyIdentifierOID ) {
      // remove from datasource
      let list = this.party.identifiers;
      let i:number = list.indexOf(this.selectedIdentifier);
      list.splice(i, 1);
      // force binding refresh
      this.party.identifiers = list.slice();
      this.selectedIdentifier = null;
    } else {
      this.selectedIdentifier = { ...this.selectedIdentifierCopy }
    }
    // deselect item in grid
    this.selectedIdentifier = null;
  }

  saveIdentifier() {
    this.newIdentifierMode = false;

    // TODO: Process save
    //
    this.selectedIdentifier = null;
  }

  /* -------------------
      Email Methods
    --------------------  */
    newEmail() {
      this.newEmailMode = true;
      this.selectedEmail = new Email();
      this.party.emails.push(this.selectedEmail);
      this.party.emails = this.party.emails.slice();
    }

    emailOnRowSelect(event){
      this.selectedEmailCopy = { ...this.selectedEmail }
      this.selectedEmail = event.data;
    }

    emailTypeOnChange(event) {
      this.selectedEmail.emailAddressType = event.value;
    }

    requestDeleteEmail() {
      this.showDeleteEmailModal = true;
    }

    deleteEmail() {
      this.showDeleteEmailModal = false;
      // TODO: Process delete
    }

    cancelEmailEdit() {
      this.newEmailMode = false;
      if(!this.selectedEmail.partyEmailOID ) {
        // remove from datasource
        let list  = this.party.emails;
        let i:number = list.indexOf(this.selectedEmail);
        list.splice(i, 1);
        // force binding refresh
        this.party.emails = list.slice();
      } else {
        this.selectedEmail = { ...this.selectedEmailCopy }
      }
      this.selectedEmail = null;
    }

    saveEmail() {
      this.newEmailMode = false;

      // TODO: Process save
      this.selectedEmail = null;
    }


    /* -------------------
      Phone Number Methods
    --------------------  */
    newPhone() {
      this.newPhoneMode = true;
      this.selectedPhone = new PhoneNumber();
      this.party.phoneNumbers.push(this.selectedPhone);
      this.party.phoneNumbers = this.party.phoneNumbers.slice();
    }

    phoneOnRowSelect(event){
      this.selectedPhoneCopy = { ...this.selectedPhone }
      this.selectedPhone = event.data;
    }

    phoneTypeOnChange(event) {
      this.selectedPhone.phoneType = event.value;
    }

    requestDeletePhone() {
      this.showDeletePhoneModal = true;
    }
    deletePhone() {
      this.showDeletePhoneModal = false;
      // TODO: Process delete
    }


    cancelPhoneEdit() {
      this.newPhoneMode = false;
      if(!this.selectedPhone.partyPhoneOID) {
        // remove from datasource
        let list  = this.party.phoneNumbers;
        let i:number = list.indexOf(this.selectedPhone);
        list.splice(i, 1);
        // force binding refresh
        this.party.phoneNumbers = list.slice();
      } else {
        this.selectedPhone = { ...this.selectedPhoneCopy }
      }
      this.selectedPhone = null;
    }

    savePhone() {
      this.newPhoneMode = false;

      // TODO: Process save
      //
      this.selectedPhone = null;
    }


    /* -------------------
      Address Methods
    --------------------  */
    newAddress() {
      this.newAddressMode = true;
      this.selectedAddress = new Address();
      this.party.addresses.push(this.selectedAddress);
      this.party.addresses = this.party.addresses.slice();
    }

    addressOnRowSelect(event){
      this.selectedAddressCopy = { ...this.selectedAddress }
      this.selectedAddress = event.data;
    }

    addressTypeOnChange(event) {
      this.selectedAddress.addressType = event.value;
    }

    countryOnChange(event) {
      this.selectedAddress.countryName = event.value;
    }

    requestDeleteAddress() {
      this.showDeleteAddressModal = true;
    }
    deleteAddress() {
      this.showDeleteAddressModal = false;
      // TODO: Process delete
    }

    cancelAddressEdit() {
      this.newAddressMode = false;
      if(!this.selectedAddress.addressOID ) {
        // remove from datasource
        let list  = this.party.addresses;
        let i:number = list.indexOf(this.selectedAddress);
        list.splice(i, 1);
        // force binding refresh
        this.party.addresses = list.slice();
      } else {
        this.selectedAddress = { ...this.selectedAddressCopy }
      }
      this.selectedAddress = null;
    }

    saveAddress() {
      this.newAddressMode = false;

      // TODO: Process save
      //
      this.selectedAddress = null;
    }

    hideModals(){
      this.showDeleteIdentifierModal = false;
      this.showDeleteEmailModal = false;
      this.showDeletePhoneModal = false;
      this.showDeleteAddressModal = false;
    }



  private buildRefData() {

    this.genderTypes = [
      {label:'M', value:'M'}, {label:'F', value:'F'},
    ];

  }
}
