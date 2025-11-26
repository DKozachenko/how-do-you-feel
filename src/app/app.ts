import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MainLayoutComponent } from '@layout/main-layout/main-layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [MainLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
