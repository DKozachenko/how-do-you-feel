import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { Action } from '@core/model/action.interface';
import { BlurDirective } from '@ui/blur/blur.directive';
import { ReplaceStringPipe } from '@ui/blur/replace-string.pipe';
import { WrapLinesDirective } from '@ui/wrap-lines/wrap-lines.directive';
import { SortDatesPipe } from '../sort-dates/sort-dates.pipe';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.html',
  styleUrl: './action-card.scss',
  imports: [
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonButton,
    IonIcon,
    IonCardTitle,
    IonBadge,
    DatePipe,
    IonText,
    SortDatesPipe,
    WrapLinesDirective,
    BlurDirective,
    ReplaceStringPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionCard {
  action = input.required<Action>();

  edit = output<Action>();
  remove = output<string>();

  blurCard = linkedSignal(() => this.action().private);
  textReplacement = linkedSignal(() => this.action().private);

  toggleBlurCard(): void {
    this.blurCard.update((value) => !value);
  }

  toggleTextReplace(value: boolean): void {
    this.textReplacement.set(value);
  }
}
