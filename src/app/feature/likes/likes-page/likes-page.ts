import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-likes-page',
  templateUrl: './likes-page.html',
  styleUrl: './likes-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LikesPage {}
