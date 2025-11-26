import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-journal-page',
  templateUrl: './journal-page.html',
  styleUrl: './journal-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalPage {}
