import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastItems',
})
export class LastItemsPipe implements PipeTransform {
  transform(value: Date[], take: number): Date[] {
    return value.slice(-take);
  }
}
