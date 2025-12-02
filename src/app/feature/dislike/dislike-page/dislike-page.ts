import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
import { Action } from '@core/model/action.interface';
import { ModalRole } from '@core/model/modal-role.enum';
import { ActionCard } from '@pattern/action/action-card/action-card';
import { EditActionModal } from '@pattern/action/edit-action-modal/edit-action-modal';
import { DisikesStorageService } from '../storage/dislikes-storage';

@Component({
  selector: 'app-dislike-page',
  templateUrl: './dislike-page.html',
  styleUrl: './dislike-page.scss',
  imports: [IonHeader, IonContent, IonList, IonToolbar, IonTitle, IonButton, IonText, ActionCard],
  providers: [DisikesStorageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LikePage implements ViewWillEnter {
  protected readonly dislikesStorageService = inject(DisikesStorageService);
  private readonly modalController = inject(ModalController);

  dislikes = signal<Action[]>([]);

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
    this.dislikesStorageService.getAll().subscribe((data) => this.dislikes.set(data ?? []));
  }
}
