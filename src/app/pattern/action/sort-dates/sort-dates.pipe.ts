import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortDates',
})
export class SortDatesPipe implements PipeTransform {
  transform(value: Date[]): Date[] {
    const sortedEntries = value.sort((dateA, dateB) => {
      return dateA.getTime() - dateB.getTime();
    });

    return sortedEntries;
  }
}
