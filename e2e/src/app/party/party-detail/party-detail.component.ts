import { UserService } from '../../common/services/utility/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { SelectItem } from 'primeng/primeng';

import { GenericTypesService } from '../../common/services/http/generic.types.service';
import { PhoneNumber } from '../../common/entities/PhoneNumber';
import { Address } from '../../common/entities/Address';
import { PartyService } from '../../common/services/http/party.service';
import { DropdownDataTransformService } from '../../common/services/utility/dropdown-data-transform.service';
import { BreadcrumbService } from '../../breadcrumb.service';
import { DateConverter } from '../../common/utils/date-converter';
import { Identifier } from '../../common/entities/Identifier';
import { IdentifierService } from '../../common/services/http/identifier.service';
import { Language } from '../../common/entities/Language';
import { LanguageService } from '../../common/services/http/language.service';
import { Party } from '../../common/entities/Party';
import { ToastService } from '../../common/services/utility/toast.service';
import { Email } from '../../common/entities/Email';
import { CountriesService } from '../../common/services/http/countries.service';
import { CountriesAddressService } from '../../common/services/http/countriesAddress.service';
import { OccupationService } from '../../common/services/http/occupation.service';
import { CollectionUtil } from '../../common/utils/collection-util';
import { Permission } from '../../common/entities/Permission';
import { Occupation } from '../../common/entities/Occupation';


@Component({
  selector: 'app-party-detail',
  templateUrl: './party-detail.component.html',
  styleUrls: ['./party-detail.component.scss']
})
export class PartyDetailComponent implements OnInit, OnDestroy {

  lockApiCalls: boolean = false;
  addressTypes: SelectItem[];
  selectedAddress: Address;
  addressToDelete: Address;
  selectedAddressCopy: Address;
  countries: SelectItem[];
  countriesAddressCityTown: SelectItem[];
  countriesAddressCommunityCode: SelectItem[];
  countriesAddressAdminCode: SelectItem[];
  countriesAddressPostalCode: SelectItem[];
  countriesSubscription: Subscription;
  countriesAddressSubscription: Subscription;
  occupation: SelectItem[];
  occupationSubscription: Subscription;
  emailTypes: SelectItem[];
  selectedEmail: Email;
  emailToDelete: Email;
  selectedEmailCopy: Email;
  filteredLanguages: string[];
  genderTypes: any[];
  maritalStatus: any[];
  genericSubsciption: Subscription;
  selectedIdentifier: Identifier;
  selectedOccupation: Occupation;
  identifierToDelete: Identifier;
  occupationToDelete: Occupation;
  selectedIdentifierCopy: Identifier;
  selectedOccupationCopy: Occupation;
  identifierTypes: Identifier[];
  identifierTypeOptions: SelectItem[];
  identifierSubscription: Subscription;
  languages: Language[];
  languageSubscription: Subscription;
  party: Party;
  partySubscription: Subscription;
  phoneTypes: SelectItem[];
  selectedPhone: PhoneNumber;
  phoneToDelete: PhoneNumber;
  selectedPhoneCopy: PhoneNumber;

  newEmailMode: boolean = false;
  newIdentifierMode: boolean = false;
  newOccupationMode: boolean = false;
  newPhoneMode: boolean = false;
  newAddressMode: boolean = false;

  showDeleteIdentifierModal: boolean = false;
  showDeleteOccupationModal = false;
  showDeleteEmailModal: boolean = false;
  showDeletePhoneModal: boolean = false;
  showDeleteAddressModal: boolean = false;
  public Permission: any = Permission;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadCrumbSvc: BreadcrumbService,
    private toastSvc: ToastService,
    private languageSvc: LanguageService,
    private identifierSvc: IdentifierService,
    private dropdownSvc: DropdownDataTransformService,
    private partySvc: PartyService,
    private genericTypeSvc: GenericTypesService,
    private countriesSvc: CountriesService,
    private countriesAddressDetailsSvc: CountriesAddressService,
    private occupationSvc: OccupationService,
    private router: Router,
    private userSvc: UserService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Party Detail', routerLink: ['/party-detail'] }
    ]);
  }

  ngOnInit() {

    this.initializeParty();

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

    this.languageSubscription = this.languageSvc.get().subscribe(langs => {
      this.languages = langs;
      // this.projectCopy = { ...this.project }
      //console.log('languages', langs);
    });

    this.identifierSubscription = this.identifierSvc.get().subscribe(items => {
      this.identifierTypes = items;
      this.identifierTypeOptions = this.dropdownSvc.transformSameLabelAndValue(this.identifierTypes, 'name');
    });

    this.genericSubsciption = this.genericTypeSvc.get().subscribe(types => {
      let gTypes = this.dropdownSvc.transformSameLabelAndValue(types, 'name');
      this.emailTypes = gTypes;
      this.addressTypes = gTypes;
      this.phoneTypes = gTypes;
    });

    this.countriesSubscription = this.countriesSvc.get().subscribe(countries => {
      this.countries = this.dropdownSvc.transformSameLabelAndValue(countries, 'name');
    })

    this.countriesAddressSubscription = this.countriesAddressDetailsSvc.get().subscribe(countriesAddressDetails => {
      this.countriesAddressCityTown = this.dropdownSvc.transform(countriesAddressDetails, 'cityTown','id');
      this.countriesAddressCommunityCode = this.dropdownSvc.transform(countriesAddressDetails, 'communityCode','id');
      this.countriesAddressAdminCode = this.dropdownSvc.transform(countriesAddressDetails, 'adminCode','id');
      this.countriesAddressPostalCode = this.dropdownSvc.transform(countriesAddressDetails, 'postalCode','id');
    })

    this.occupationSubscription = this.occupationSvc.get().subscribe(occupation => {
      this.occupation = this.dropdownSvc.transformSameLabelAndValue(occupation, 'name');
    })
    
    this.buildRefData();

    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.initializeParty();
        }
      })
  }

  private initializeParty(): void {
    let params: any = this.activatedRoute.params;
    let partyId: string = params.value.partyId;

    if (partyId == "0" || partyId == null) {
      // TODO: Create New Party with empty properties;
      // new'ing doesn't bring properties w/o constructor on entity!?
      this.party = new Party();
      console.log('Create New Party',this.party);
    } else {
      this.partySubscription = this.partySvc.fetchOne(partyId).subscribe(party => {
        this.party = party;
      });

    }
  }

  ngOnDestroy() {
    if (this.languageSubscription) this.languageSubscription.unsubscribe();
    if (this.identifierSubscription) this.identifierSubscription.unsubscribe();
    if (this.partySubscription) this.partySubscription.unsubscribe();
    if (this.genericSubsciption) this.genericSubsciption.unsubscribe();
    if (this.countriesSubscription) this.countriesSubscription.unsubscribe();
    if (this.countriesAddressSubscription) this.countriesAddressSubscription.unsubscribe();
  }


  /* -------------------
    General Details Methods
    --------------------  */

  newFNameChanged(event) {
    this.party.firstName = event;
    if (this.party.lastName) {
      this.party.fullName = this.party.firstName + " "
        + this.party.lastName;
    } else {
      this.party.fullName = this.party.firstName;
    }
  }

  newLNameChanged(event) {
    this.party.lastName = event;
    if (this.party.firstName) {
      this.party.fullName = this.party.firstName + " "
        + this.party.lastName;
    } else {
      this.party.fullName = this.party.lastName;
    }
  }

  hasPermission(pm) {
    if (!this.party) return false;
    return this.userSvc.hasPermission(pm);
  }

  calculateAge(dob) {
    if (!dob) return;
    return moment().diff(dob, 'years');
  }

  genderTypesOnChange(event) {
    this.party.sex = event.value;
  }

  maritalStatusOnChange(event) {
    this.party.maritalStatus = event.value;
  }

  getLangsToFilter(event) {
    let query = event.query;
    // this.languageService.get().then(langs => {
    //     this.filteredLanguages = this.filterLangs(query, langs);
    // });
    this.filteredLanguages = this.filterLangs(query, this.languages);
  }

  filterLangs(query, languages: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < languages.length; i++) {
      let lang = languages[i];
      if (lang.languageName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
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
    console.log(this.party);

    this.saveParty();
  }

    /* -------------------
      Occupation Methods
    ---------------------*/
    newOccupation() {

      this.newOccupationMode = true;
      this.selectedOccupation = new Occupation();
      this.party.occupations.push(this.selectedOccupation);
      this.party.occupations = this.party.occupations.slice();
    }

    occupationOnRowSelect(event) {
      this.selectedOccupationCopy = { ...this.selectedOccupation }
      this.selectedOccupation = event.data;
    }

    occupationTypeOnChange(event) {
      this.selectedOccupation.jobTitle = event.value;
    }

    requestDeleteOccupation(occupation: Occupation) {
      this.showDeleteOccupationModal = true;
      this.occupationToDelete = occupation;
    }
  
    deleteOccupation() {
      this.showDeleteOccupationModal = false;
      CollectionUtil.removeArrayItem(this.party.occupations, this.occupationToDelete);
      this.saveParty(false);
      this.occupationToDelete = null;
      this.selectedOccupationCopy = null;
      this.selectedOccupation = null;
      this.newOccupationMode = false;
    }

    cancelOccupationEdit(){
      this.newOccupationMode = false;
      if (!this.selectedOccupation.partyOccupationOID) {
        // remove from datasource
        let list = this.party.occupations;
        let i: number = list.indexOf(this.selectedOccupation);
        list.splice(i, 1);
        // force binding refresh
        this.party.occupations = list.slice();
        this.selectedOccupation = null;
      } else {
        this.selectedOccupation = { ...this.selectedOccupationCopy }
      }
      // deselect item in grid
      this.selectedOccupation = null;
      this.selectedOccupationCopy = null;
    }

    saveOccupation(){    

      this.selectedOccupation = null;
      this.newOccupationMode = false;
      this.saveParty();   
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

  identifierOnRowSelect(event) {
    this.selectedIdentifierCopy = { ...this.selectedIdentifier }
    this.selectedIdentifier = event.data;
  }

  identifierTypeOnChange(event) {
    this.selectedIdentifier.identifierType = event.value;
  }

  countryOfBirthOnChange(event) {
    this.party.countryOfBirth = event.value;
  }

  countryOfResidenceOnChange(event) {
    this.party.countryOfResidence = event.value;
  }

  requestDeleteIdentifier(identifier: Identifier) {
    this.showDeleteIdentifierModal = true;
    this.identifierToDelete = identifier;
  }

  deleteIdentifier() {
    this.showDeleteIdentifierModal = false;
    CollectionUtil.removeArrayItem(this.party.identifiers, this.identifierToDelete);
    this.saveParty(false);
    this.identifierToDelete = null;
    this.selectedIdentifierCopy = null;
    this.selectedIdentifier = null;
    this.newIdentifierMode = false;
  }

  cancelIdentifierEdit() {
    this.newIdentifierMode = false;
    if (!this.selectedIdentifier.partyIdentifierOID) {
      // remove from datasource
      let list = this.party.identifiers;
      let i: number = list.indexOf(this.selectedIdentifier);
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
    this.selectedIdentifier = null;
    this.saveParty();
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

  emailOnRowSelect(event) {
    this.selectedEmailCopy = { ...this.selectedEmail }
    this.selectedEmail = event.data;
  }

  emailTypeOnChange(event) {
    this.selectedEmail.emailAddressType = event.value;
  }

  requestDeleteEmail(email: Email) {
    this.showDeleteEmailModal = true;
    this.emailToDelete = email;
  }

  deleteEmail() {
    this.showDeleteEmailModal = false;

    CollectionUtil.removeArrayItem(this.party.emails, this.emailToDelete);
    this.saveParty(false);
    this.emailToDelete = null;
    this.selectedEmailCopy = null;
    this.selectedEmail = null;
    this.newEmailMode = false;
  }

  cancelEmailEdit() {
    this.newEmailMode = false;
    if (!this.selectedEmail.partyEmailOID) {
      // remove from datasource
      let list = this.party.emails;
      let i: number = list.indexOf(this.selectedEmail);
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

    this.selectedEmail = null;
    this.saveParty();
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

  phoneOnRowSelect(event) {
    this.selectedPhoneCopy = { ...this.selectedPhone }
    this.selectedPhone = event.data;
  }

  phoneTypeOnChange(event) {
    this.selectedPhone.phoneType = event.value;
  }

  requestDeletePhone(phone: PhoneNumber) {
    this.showDeletePhoneModal = true;
    this.phoneToDelete = phone;
  }
  deletePhone() {
    this.showDeletePhoneModal = false;

    CollectionUtil.removeArrayItem(this.party.phoneNumbers, this.phoneToDelete);
    this.saveParty(false);
    this.phoneToDelete = null;
    this.selectedPhoneCopy = null;
    this.selectedPhone = null;
    this.newPhoneMode = false;
  }


  cancelPhoneEdit() {
    this.newPhoneMode = false;
    if (!this.selectedPhone.partyPhoneOID) {
      // remove from datasource
      let list = this.party.phoneNumbers;
      let i: number = list.indexOf(this.selectedPhone);
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

    this.selectedPhone = null;
    this.saveParty();
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

  addressOnRowSelect(event) {
    this.selectedAddressCopy = { ...this.selectedAddress }
    this.selectedAddress = event.data;
  }

  addressTypeOnChange(event) {
    this.selectedAddress.addressType = event.value;
  }

  countryOnChange(event) {
    this.selectedAddress.countryName = event.value;
  }

  cityTownOnChange(event) {

    this.selectedAddress.communityCode = this.countriesAddressCommunityCode[event.value-1].label;
    this.selectedAddress.administrativeArea = this.countriesAddressAdminCode[event.value-1].label; 
    this.selectedAddress.postalCode = this.countriesAddressPostalCode[event.value-1].label;
    this.selectedAddress.municipalityName = event.value;    
  }

  requestDeleteAddress(address: Address) {
    this.showDeleteAddressModal = true;
    this.addressToDelete = address;
  }

  deleteAddress() {
    this.showDeleteAddressModal = false;

    CollectionUtil.removeArrayItem(this.party.addresses, this.addressToDelete);
    this.saveParty(false);
    this.addressToDelete = null;
    this.selectedAddressCopy = null;
    this.selectedAddress = null;
    this.newAddressMode = false;
  }

  cancelAddressEdit() {
    this.newAddressMode = false;
    if (!this.selectedAddress.addressOID) {
      // remove from datasource
      let list = this.party.addresses;
      let i: number = list.indexOf(this.selectedAddress);
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

    this.selectedAddress = null;

    this.saveParty();
  }

  hideModals() {
    this.showDeleteIdentifierModal = false;
    this.showDeleteOccupationModal = false;
    this.showDeleteEmailModal = false;
    this.showDeletePhoneModal = false;
    this.showDeleteAddressModal = false;
  }



  private buildRefData() {

    this.genderTypes = [
      { label: 'M', value: 'M' }, { label: 'F', value: 'F' },
    ];

    this.maritalStatus = [
      { label: 'Single', value: 'Single' }, 
      { label: 'Married', value: 'Married' },
      { label: 'Separated', value: 'Separated' },
      { label: 'Divorced', value: 'Divorced' },
      { label: 'Widowed', value: 'Widowed' },
      { label: 'Spinster', value: 'Spinster' },
    ];

  }

  private saveParty(shouldShowSuccessMessage: boolean = true): void {
    console.log(this.party);
    this.partySvc
      .saveParty(this.party)
      .subscribe(result => {
        console.log("Party saved");
        let shouldRedirectToEditPartyRoute: boolean = !this.party.partyOID;
        this.party = result;
        if (shouldShowSuccessMessage) {
          this.toastSvc.showSuccessMessage('Party Saved!');
        }
        if (shouldRedirectToEditPartyRoute) {
          this.router.navigate(["party-detail", this.party.partyOID]);
        }
      });
  }


}
