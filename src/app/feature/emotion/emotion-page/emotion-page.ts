import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonContent, IonIcon, ModalController } from '@ionic/angular/standalone';
import { forkJoin, from, of, switchMap } from 'rxjs';
import { Emotion } from '@core/model/emotion.interface';
import { ModalRole } from '@core/model/modal-role.enum';
import { PulseButtonComponent } from '@ui/pulse-button/pulse-button';
import { AddEmotionModal } from '../add-emotion-modal/add-emotion-modal';
import { EmotionStorageService } from '../storage/emotion-storage';

@Component({
  selector: 'app-emotion-page',
  templateUrl: './emotion-page.html',
  styleUrl: './emotion-page.scss',
  imports: [IonContent, PulseButtonComponent, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmotionPage {
  private readonly emotionsStorageService = inject(EmotionStorageService);
  private readonly modalController = inject(ModalController);

  openAddEmotionModal(): void {
    from(
      this.modalController.create({
        component: AddEmotionModal,
      }),
    )
      .pipe(
        switchMap((modal) => forkJoin([from(modal.onWillDismiss<Emotion>()), modal.present()])),
        switchMap(([{ data, role }]) => {
          if (role === ModalRole.Confirm && data) {
            return this.emotionsStorageService.create(data);
          }
          return of();
        }),
      )
      .subscribe();
  }
}
