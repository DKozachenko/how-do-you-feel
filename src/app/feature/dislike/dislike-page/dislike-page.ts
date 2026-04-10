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
  IonText,
} from '@ionic/angular/standalone';
import { forkJoin, from, of, switchMap } from 'rxjs';
import { DislikesStorageService } from '@core/dislikes/dislikes-storage.service';
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
  selector: 'app-dislike-page',
  templateUrl: './dislike-page.html',
  styleUrl: './dislike-page.scss',
  imports: [
    IonHeader,
    IonContent,
    IonList,
    IonToolbar,
    IonTitle,
    IonButton,
    IonText,
    ActionCard,
    SearchComponent,
    FilterActionsPipe,
    SortActionsPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LikePage implements ViewWillEnter {
  private readonly dislikesStorageService = inject(DislikesStorageService);
  private readonly settingStorageService = inject(SettingsStorageService);
  private readonly modalController = inject(ModalController);

  dislikes = signal<Action[]>([]);
  dislikesCount = computed(() => this.dislikes().length);
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
              return this.dislikesStorageService.updateById(action.id, data);
            } else {
              return this.dislikesStorageService.create(data);
            }
          }
          return of();
        }),
      )
      .subscribe(() => this.load());
  }

  remove(id: string): void {
    this.dislikesStorageService.removeById(id).subscribe(() => this.load());
  }

  private load(): void {
    forkJoin([
      this.dislikesStorageService.getAll(),
      this.settingStorageService.getById<ActionOrder>(SettingsIds.ACTION_ORDER),
    ]).subscribe(([dislikes, setting]) => {
      this.dislikes.set(dislikes ?? []);
      this.actionOrder.set(setting?.value ?? ActionOrder.DEFAULT_ORDER);
    });
  }
}
