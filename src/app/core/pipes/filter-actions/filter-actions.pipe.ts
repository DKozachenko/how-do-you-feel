import { Pipe, PipeTransform } from '@angular/core';
import { Action } from '../../model/action.interface';

@Pipe({
  name: 'filterActions',
})
export class FilterActionsPipe implements PipeTransform {
  transform(actions: Action[], searchInput: string): Action[] {
    if (!searchInput) {
      return actions;
    }

    const queryLowercase = searchInput.toLocaleLowerCase();
    return actions.filter(
      (action) =>
        action.name.toLocaleLowerCase().includes(queryLowercase) ||
        (action.comment ?? '').toLocaleLowerCase().includes(queryLowercase),
    );
  }
}
