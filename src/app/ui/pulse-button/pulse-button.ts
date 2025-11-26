import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pulse-button',
  templateUrl: './pulse-button.html',
  styleUrl: './pulse-button.scss',
  imports: [IonButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulseButtonComponent {}
