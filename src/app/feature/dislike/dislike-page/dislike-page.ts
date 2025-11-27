import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dislike-page',
  templateUrl: './dislike-page.html',
  styleUrl: './dislike-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DislikePage {}
