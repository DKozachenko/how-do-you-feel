import { Directive, effect, ElementRef, inject, input, output, Renderer2 } from '@angular/core';
import { timer } from 'rxjs';

export const BLUR_ANIMATION_DURATION_MS = 800;

@Directive({
  selector: '[blur]',
  host: {
    '[style.transition]': '`filter ${ANIMATION_DURATION_MS}ms ease-in-out`',
  },
})
export class BlurDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  protected readonly ANIMATION_DURATION_MS = BLUR_ANIMATION_DURATION_MS;

  blurEnabled = input.required<boolean>();

  enableReplaceText = output<boolean>();

  constructor() {
    effect(() => {
      if (!this.elementRef.nativeElement.innerHTML) {
        return;
      }

      this.checkEnabled();
    });
  }

  private checkEnabled(): void {
    if (this.blurEnabled()) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'filter', 'blur(10px)');
      timer(BLUR_ANIMATION_DURATION_MS / 2).subscribe(() => this.enableReplaceText.emit(true));
    } else {
      this.enableReplaceText.emit(false);
      timer(50).subscribe(() => this.renderer.setStyle(this.elementRef.nativeElement, 'filter', 'initial'));
    }
  }
}
