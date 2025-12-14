import { Pipe, PipeTransform } from '@angular/core';
import { Emotion } from '@core/model/emotion.interface';

@Pipe({
  name: 'sortByTime',
})
export class SortByTimePipe implements PipeTransform {
  transform(value: Emotion[]): Emotion[] {
    const sortedEntries = Array.from(value).sort((emotionA, emotionB) => {
      const dateObjA = emotionA.dateTime;
      const dateObjB = emotionB.dateTime;

      return dateObjB.getTime() - dateObjA.getTime();
    });

    return sortedEntries;
  }
}
