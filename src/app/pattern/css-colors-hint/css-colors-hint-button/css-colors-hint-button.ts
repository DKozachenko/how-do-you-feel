import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { from, switchMap } from 'rxjs';
import { CssColorsHintModal } from '../css-colors-hint-modal/css-colors-hint-modal';

@Component({
  selector: 'app-css-colors-hint-button',
  templateUrl: './css-colors-hint-button.html',
  styleUrl: './css-colors-hint-button.scss',
  imports: [IonButton, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CssColorsHintButton {
  private readonly modalController = inject(ModalController);

  openCssColorsHintModal(): void {
    from(
      this.modalController.create({
        component: CssColorsHintModal,
        cssClass: ['slider-modal', 'css-colors-modal'],
        showBackdrop: false,
      }),
    )
      .pipe(switchMap((modal) => modal.present()))
      .subscribe();
  }
}
