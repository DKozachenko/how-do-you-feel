import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { ModalRole } from '@core/model/modal-role.enum';

@Component({
  selector: 'app-add-emotion-modal',
  templateUrl: './add-emotion-modal.html',
  styleUrl: './add-emotion-modal.scss',
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonTitle,
    IonButtons,
    IonIcon,
    IonItem,
    IonInput,
    IonTextarea,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEmotionModal {
  private readonly modalCtrl = inject(ModalController);

  protected readonly ModalRole = ModalRole;

  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    comment: new FormControl<string>(''),
  });

  close(role: ModalRole, data?: unknown): void {
    this.modalCtrl.dismiss(data, role);
  }
}
