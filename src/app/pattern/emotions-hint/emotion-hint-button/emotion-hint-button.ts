import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { from, switchMap } from 'rxjs';
import { EmotionsHintModal } from '../emotions-hint-modal/emotions-hint-modal';

@Component({
  selector: 'app-emotion-hint-button',
  templateUrl: './emotion-hint-button.html',
  styleUrl: './emotion-hint-button.scss',
  imports: [IonButton, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmotionHintButton {
  private readonly modalController = inject(ModalController);

  openEmotionsHintModal(): void {
    from(
      this.modalController.create({
        component: EmotionsHintModal,
        cssClass: 'slider-modal',
        showBackdrop: false,
      }),
    )
      .pipe(switchMap((modal) => modal.present()))
      .subscribe();
  }
}
