import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs-layout',
  templateUrl: './tabs-layout.html',
  imports: [IonTabButton, IonTabs, IonTabBar, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsLayoutComponent {}
