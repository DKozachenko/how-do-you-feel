import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { Emotion } from '@core/model/emotion.interface';
import { WrapLinesDirective } from '@ui/wrap-lines/wrap-lines.directive';

@Component({
  selector: 'app-emotion-card',
  templateUrl: './emotion-card.html',
  styleUrl: './emotion-card.scss',
  imports: [IonCard, IonCardHeader, IonCardContent, IonButton, IonIcon, IonCardTitle, IonBadge, WrapLinesDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmotionCard {
  emotion = input.required<Emotion>();

  time = computed(
    () =>
      `${this.emotion().dateTime.getHours().toString().padStart(2, '0')}:${this.emotion().dateTime.getMinutes().toString().padStart(2, '0')}`,
  );

  edit = output<Emotion>();
  remove = output<string>();
}
