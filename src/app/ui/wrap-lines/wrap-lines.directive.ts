import { Directive } from '@angular/core';

@Directive({
  selector: '[wrapLines]',
  host: {
    '[style.whiteSpace]': '"pre-line"',
  },
})
export class WrapLinesDirective {}
