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
import { format } from 'date-fns';
import { forkJoin, from, map, of, switchMap } from 'rxjs';
import { EmotionStorageService } from '@core/emotions/emotions-storage';
import { Emotion } from '@core/model/emotion.interface';
import { MAIN_DATE_FORMAT } from '@core/model/main-date-format.constant';
import { ModalRole } from '@core/model/modal-role.enum';
import { EditEmotionModal } from '../edit-emotion-modal/edit-emotion-modal';
import { EmotionCard } from '../emotion-card/emotion-card';
import { FilterByRangePipe } from '../filter-by-range/filter-by-range.pipe';
import { RangeFilter } from '../range-filter/range-filter';
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
    FilterByRangePipe,
    EmotionCard,
    RangeFilter,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalPage implements ViewWillEnter {
  private readonly modalController = inject(ModalController);
  private readonly emotionsStorageService = inject(EmotionStorageService);

  emotionsMap = signal(new Map<string, Emotion[]>());

  rangeFilters = signal<[Date, Date] | null>(null);

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
      const dateWithoutTime = format(emotion.dateTime, MAIN_DATE_FORMAT);

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
