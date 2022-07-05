import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'encodeURIComponentPipe' })
export class EncodeURIComponentPipe implements PipeTransform {

  transform(input) {

    if (typeof (input) !== "string") {
      return input;
    }

    return encodeURIComponent(input);

  }

}
