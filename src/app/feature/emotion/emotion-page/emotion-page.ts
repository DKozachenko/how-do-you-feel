import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { IonicStorageService } from '@core/storage/ionic-storage.service';
import { PulseButtonComponent } from '@ui/pulse-button/pulse-button';

@Component({
  selector: 'app-emotion-page',
  templateUrl: './emotion-page.html',
  styleUrl: './emotion-page.scss',
  imports: [IonContent, PulseButtonComponent, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmotionPage implements OnInit {
  private readonly storageService = inject(IonicStorageService);

  ngOnInit(): void {
    this.storageService.set<boolean>('test', true).subscribe();
  }
}
