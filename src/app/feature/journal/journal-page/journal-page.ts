import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
  ModalController,
  ViewWillEnter,
  IonLabel,
  IonItemGroup,
  IonItemDivider,
} from '@ionic/angular/standalone';
import { forkJoin, from, map, of, switchMap } from 'rxjs';
import { EmotionStorageService } from '@core/emotions/emotions-storage';
import { Emotion } from '@core/model/emotion.interface';
import { ModalRole } from '@core/model/modal-role.enum';
import { EditEmotionModal } from '../edit-emotion-modal/edit-emotion-modal';
import { EmotionCard } from '../emotion-card/emotion-card';
import { SortByDatesPipe } from '../sort-by-dates/sort-by-dates.pipe';

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
    IonLabel,
    IonItemGroup,
    IonItemDivider,
    SortByDatesPipe,
    EmotionCard,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalPage implements ViewWillEnter {
  private readonly modalController = inject(ModalController);
  private readonly emotionsStorageService = inject(EmotionStorageService);
  emotionsMap = signal(new Map<string, Emotion[]>());

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
    this.emotionsStorageService
      .getAll()
      .pipe(map((data) => this.groupEmotionsByDate(data ?? [])))
      .subscribe((groups) => this.emotionsMap.set(groups ?? []));
  }

  private groupEmotionsByDate(emotions: Emotion[]): Map<string, Emotion[]> {
    return emotions.reduce((acc, emotion) => {
      const dateWithoutTime = `${emotion.dateTime.getDate()}.${emotion.dateTime.getMonth() + 1}.${emotion.dateTime.getFullYear()}`;

      if (!acc.has(dateWithoutTime)) {
        acc.set(dateWithoutTime, []);
      }
      const emotions = acc.get(dateWithoutTime);
      const newEmotions = [...(emotions ?? []), emotion];
      acc.set(dateWithoutTime, newEmotions);

      return acc;
    }, new Map<string, Emotion[]>());
  }
}
