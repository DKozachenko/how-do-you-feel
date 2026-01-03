import { Pipe, PipeTransform } from '@angular/core';

const HIDE_SYMBOL = '#';

@Pipe({
  name: 'replaceString',
})
export class ReplaceStringPipe implements PipeTransform {
  transform(text: string | number, enabled: boolean): string {
    if (enabled) {
      return String(text).replace(/[\wА-Яа-я]/g, HIDE_SYMBOL);
    }

    return String(text);
  }
}
