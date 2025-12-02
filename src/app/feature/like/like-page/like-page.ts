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
} from '@ionic/angular/standalone';
import { forkJoin, from, of, switchMap } from 'rxjs';
import { Action } from '@core/model/action.interface';
import { ModalRole } from '@core/model/modal-role.enum';
import { ActionCard } from '@pattern/action-card/action-card';
import { EditActionModal } from '@pattern/edit-action-modal/edit-action-modal';
import { LikesStorageService } from '../storage/likes-storage';

@Component({
  selector: 'app-like-page',
  templateUrl: './like-page.html',
  styleUrl: './like-page.scss',
  imports: [IonHeader, IonContent, IonList, IonToolbar, IonTitle, IonButton, ActionCard],
  providers: [LikesStorageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LikePage implements ViewWillEnter {
  protected readonly likesStorageService = inject(LikesStorageService);
  private readonly modalController = inject(ModalController);

  likes = signal<Action[]>([]);

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
    this.likesStorageService.getAll().subscribe((data) => this.likes.set(data ?? []));
  }
}
