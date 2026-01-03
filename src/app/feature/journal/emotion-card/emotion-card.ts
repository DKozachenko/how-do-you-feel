import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { LONG_PRESS_TIME_MS } from '@core/gesture/long-press/long-press.constants';
import { LongPressDirective } from '@core/gesture/long-press/long-press.directive';
import { Emotion } from '@core/model/emotion.interface';
import { BlurDirective } from '@ui/blur/blur.directive';
import { ReplaceStringPipe } from '@ui/blur/replace-string.pipe';
import { WrapLinesDirective } from '@ui/wrap-lines/wrap-lines.directive';

@Component({
  selector: 'app-emotion-card',
  templateUrl: './emotion-card.html',
  styleUrl: './emotion-card.scss',
  imports: [
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonButton,
    IonIcon,
    IonCardTitle,
    IonBadge,
    WrapLinesDirective,
    BlurDirective,
    ReplaceStringPipe,
    LongPressDirective,
  ],
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

  blurCard = linkedSignal(() => this.emotion().private);
  textReplacement = linkedSignal(() => this.emotion().private);

  protected readonly LONG_PRESS_TIME_MS = LONG_PRESS_TIME_MS;

  toggleBlurCard(): void {
    this.blurCard.update((value) => !value);
  }

  toggleTextReplace(value: boolean): void {
    this.textReplacement.set(value);
  }
}
