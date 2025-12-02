import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionCard {
  action = input.required<Action>();

  edit = output<Action>();
  remove = output<string>();
}
