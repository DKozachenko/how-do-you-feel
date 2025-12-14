import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { ModalRole } from '@core/model/modal-role.enum';

register();

@Component({
  selector: 'app-emotions-hint-modal',
  templateUrl: './emotions-hint-modal.html',
  styleUrl: './emotions-hint-modal.scss',
  imports: [IonContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmotionsHintModal {
  private readonly modalController = inject(ModalController);

  protected readonly ModalRole = ModalRole;

  close(role: ModalRole, data?: unknown): void {
    this.modalController.dismiss(data, role);
  }
}
