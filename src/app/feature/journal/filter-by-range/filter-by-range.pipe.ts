import { Pipe, PipeTransform } from '@angular/core';
import { Emotion } from '@core/model/emotion.interface';

@Pipe({
  name: 'filterByRange',
})
export class FilterByRangePipe implements PipeTransform {
  transform(value: Map<string, Emotion[]>, range: [Date, Date] | null): Map<string, Emotion[]> {
    if (!range) {
      return value;
    }

    const sortedEntries = Array.from(value.entries()).filter(([date]) => {
      const [day, month, year] = date.split('.').map(Number);

      const dateObj = new Date(year, month - 1, day);
      const [from, to] = range;

      return dateObj >= from && dateObj <= to;
    });

    return new Map(sortedEntries);
  }
}
