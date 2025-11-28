import { Pipe, PipeTransform } from '@angular/core';
import { Emotion } from '@core/model/emotion.interface';

@Pipe({
  name: 'sortByDates',
})
export class SortByDatesPipe implements PipeTransform {
  transform(value: Map<string, Emotion[]>): Map<string, Emotion[]> {
    const sortedEntries = Array.from(value.entries()).sort(([dateA], [dateB]) => {
      const [dayA, monthA, yearA] = dateA.split('.').map(Number);
      const [dayB, monthB, yearB] = dateB.split('.').map(Number);

      const dateObjA = new Date(yearA, monthA - 1, dayA);
      const dateObjB = new Date(yearB, monthB - 1, dayB);

      return dateObjB.getTime() - dateObjA.getTime();
    });

    return new Map(sortedEntries);
  }
}
