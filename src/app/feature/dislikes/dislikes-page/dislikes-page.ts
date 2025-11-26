import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dislikes-page',
  templateUrl: './dislikes-page.html',
  styleUrl: './dislikes-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DislikesPage {}
