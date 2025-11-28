import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
  IonIcon,
} from '@ionic/angular/standalone';
import { EmotionStorageService } from '@core/emotions/emotions-storage';
import { Emotion } from '@core/model/emotion.interface';

@Component({
  selector: 'app-journal-page',
  templateUrl: './journal-page.html',
  styleUrl: './journal-page.scss',
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonButton,
    IonIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalPage implements OnInit {
  private readonly emotionsStorageService = inject(EmotionStorageService);
  emotions = signal<Emotion[]>([]);

  ngOnInit(): void {
    this.emotionsStorageService.getAll().subscribe((data) => this.emotions.set(data ?? []));
  }
}
