import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IonSearchbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search',
  templateUrl: './search.html',
  styleUrl: './search.scss',
  imports: [IonSearchbar],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  debounce = input<number>();
  changed = output<string>();
}
