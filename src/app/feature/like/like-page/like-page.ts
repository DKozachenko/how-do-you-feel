import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonList,
  IonTitle,
  IonToolbar,
  IonButton,
  ViewWillEnter,
  ModalController,
} from '@ionic/angular/standalone';
import { forkJoin, from, of, switchMap } from 'rxjs';
import { LikesStorageService } from '@core/likes/likes-storage.service';
import { ActionOrder } from '@core/model/action-order.constants';
import { Action } from '@core/model/action.interface';
import { ModalRole } from '@core/model/modal-role.enum';
import { SettingsIds } from '@core/model/setting.interface';
import { FilterActionsPipe } from '@core/pipes/filter-actions/filter-actions.pipe';
import { SortActionsPipe } from '@core/pipes/sort-actions/sort-actions.pipe';
import { SettingsStorageService } from '@core/settings/settings.service';
import { ActionCard } from '@pattern/action/action-card/action-card';
import { EditActionModal } from '@pattern/action/edit-action-modal/edit-action-modal';
import { SearchComponent } from '@ui/search/search';

@Component({
  selector: 'app-like-page',
  templateUrl: './like-page.html',
  styleUrl: './like-page.scss',
  imports: [
    IonHeader,
    IonContent,
    IonList,
    IonToolbar,
    IonTitle,
    IonButton,
    ActionCard,
    SearchComponent,
    FilterActionsPipe,
    SortActionsPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LikePage implements ViewWillEnter {
  private readonly likesStorageService = inject(LikesStorageService);
  private readonly settingStorageService = inject(SettingsStorageService);
  private readonly modalController = inject(ModalController);

  likes = signal<Action[]>([]);
  likesCount = computed(() => this.likes().length);
  searchInput = signal('');

  actionOrder = signal<ActionOrder>(ActionOrder.DEFAULT_ORDER);

  ionViewWillEnter(): void {
    this.load();
  }

  openEditActionModal(action?: Action): void {
    from(
      this.modalController.create({
        component: EditActionModal,
        componentProps: {
          action,
        },
      }),
    )
      .pipe(
        switchMap((modal) => forkJoin([from(modal.onWillDismiss<Omit<Action, 'id'>>()), modal.present()])),
        switchMap(([{ data, role }]) => {
          if (role === ModalRole.Confirm && data) {
            if (action) {
              return this.likesStorageService.updateById(action.id, data);
            } else {
              return this.likesStorageService.create(data);
            }
          }
          return of();
        }),
      )
      .subscribe(() => this.load());
  }

  remove(id: string): void {
    this.likesStorageService.removeById(id).subscribe(() => this.load());
  }

  private load(): void {
    forkJoin([
      this.likesStorageService.getAll(),
      this.settingStorageService.getById<ActionOrder>(SettingsIds.ACTION_ORDER),
    ]).subscribe(([likes, setting]) => {
      this.likes.set(likes ?? []);
      this.actionOrder.set(setting?.value ?? ActionOrder.DEFAULT_ORDER);
    });
  }
}
