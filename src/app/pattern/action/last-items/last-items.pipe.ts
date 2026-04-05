import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastItems',
  pure: false,
})
export class LastItemsPipe implements PipeTransform {
  transform<T>(value: T[], take: number): T[] {
    return value.slice(-take);
  }
}
