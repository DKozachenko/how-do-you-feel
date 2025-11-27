import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-like-page',
  templateUrl: './like-page.html',
  styleUrl: './like-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LikePage {}
