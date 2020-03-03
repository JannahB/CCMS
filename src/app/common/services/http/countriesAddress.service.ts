import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpBaseService } from './http-base.service';


@Injectable()
export class CountriesAddressService extends HttpBaseService<any> {

  private mockFile: string = 'countriesAddress.json';

  // Override Base URL's set in Super
  protected getBaseUrl(): string {
    console.log('Accessing Country Address Details');
    return `${super.getBaseUrl()}/api/countryAddress`;
  }

  protected getBaseMockUrl(): string {
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }


}
