import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';

declare var config: any;

@Injectable()
export class ConfigService {
  public constructor() { }

  public loadConfiguration(): void {
    console.log('**** loadingConfiguration()');

    // `config` is implied  `window.config` loaded in index.html /config/config.js
    if (typeof config === 'undefined' || Object.keys(config).length === 0) {
      console.log('config object is null or keys.length === 0');
      return;
    }

    this.mapProperties(environment, config);
  }

  private mapProperties(target: any, source: any) {
    for (const property in source) {
      if (
        typeof target[property] === 'undefined' ||
        target[property] === null ||
        typeof source[property] !== 'object' ||
        source[property] instanceof Date
      ) {
        console.log('Config replacing property ' + target[property] + ' = ' + source[property]);
        target[property] = source[property];
        continue;
      }
      this.mapProperties(target[property], source[property]);
    }
  }
}
