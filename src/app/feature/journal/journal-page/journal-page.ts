import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
  IonIcon,
  ModalController,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { forkJoin, from, of, switchMap } from 'rxjs';
import { EmotionStorageService } from '@core/emotions/emotions-storage';
import { Emotion } from '@core/model/emotion.interface';
import { ModalRole } from '@core/model/modal-role.enum';
import { EditEmotionModal } from '../edit-emotion-modal/edit-emotion-modal';

@Component({
  selector: 'app-journal-page',
  templateUrl: './journal-page.html',
  styleUrl: './journal-page.scss',
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonButton,
    IonIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalPage implements ViewWillEnter {
  private readonly modalController = inject(ModalController);
  private readonly emotionsStorageService = inject(EmotionStorageService);
  emotions = signal<Emotion[]>([]);

  ionViewWillEnter(): void {
    this.load();
  }

  remove(id: string): void {
    this.emotionsStorageService.removeById(id).subscribe(() => this.load());
  }

  openEditEmotionModal(emotion: Emotion): void {
    from(
      this.modalController.create({
        component: EditEmotionModal,
        componentProps: {
          emotion,
        },
      }),
    )
      .pipe(
        switchMap((modal) => forkJoin([from(modal.onWillDismiss<Omit<Emotion, 'id'>>()), modal.present()])),
        switchMap(([{ data, role }]) => {
          if (role === ModalRole.Confirm && data) {
            return this.emotionsStorageService.updateById(emotion.id, data);
          }
          return of();
        }),
      )
      .subscribe(() => this.load());
  }

  private load(): void {
    this.emotionsStorageService.getAll().subscribe((data) => this.emotions.set(data ?? []));
  }
}
