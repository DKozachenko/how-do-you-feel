import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent, IonHeader, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';
// eslint-disable-next-line boundaries/no-unknown
import packageJson from '../../../../../package.json';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.html',
  styleUrl: './info-page.scss',
  imports: [IonHeader, IonTitle, IonToolbar, IonContent, IonText],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPage {
  version = packageJson.version;
}
