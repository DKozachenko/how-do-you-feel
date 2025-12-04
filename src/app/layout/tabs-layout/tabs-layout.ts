import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { DISLIKE_PATHS } from '@feature/dislike/dislike.routes';
import { EMOTION_PATHS } from '@feature/emotion/emotion.routes';
import { INFO_PATHS } from '@feature/info/info.routes';
import { LIKE_PATHS } from '@feature/like/like.routes';
import { JOURNAL_PATHS } from './../../feature/journal/journal.routes';

@Component({
  selector: 'app-tabs-layout',
  templateUrl: './tabs-layout.html',
  imports: [IonTabButton, IonTabs, IonTabBar, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsLayoutComponent {
  protected readonly DISLIKE_PATHS = DISLIKE_PATHS;
  protected readonly LIKE_PATHS = LIKE_PATHS;
  protected readonly EMOTION_PATHS = EMOTION_PATHS;
  protected readonly JOURNAL_PATHS = JOURNAL_PATHS;
  protected readonly INFO_PATHS = INFO_PATHS;
}
