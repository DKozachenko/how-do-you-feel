import { Pipe, PipeTransform } from '@angular/core';
import { max } from 'date-fns';
import { ActionOrder } from '@core/model/action-order.constants';
import { Action } from '../../model/action.interface';

@Pipe({
  name: 'sortActions',
})
export class SortActionsPipe implements PipeTransform {
  transform(actions: Action[], actionOrder: ActionOrder): Action[] {
    if (actionOrder === ActionOrder.DEFAULT_ORDER) {
      return actions;
    }

    return actions.sort((actionA, actionB) => {
      const lastActionADate = max(actionA.history);
      const lastActionBDate = max(actionB.history);

      return lastActionBDate.getTime() - lastActionADate.getTime();
    });
  }
}
