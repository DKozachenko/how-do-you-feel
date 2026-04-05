import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ActionSheetController, IonButton, IonIcon } from '@ionic/angular/standalone';
import { from, switchMap } from 'rxjs';

@Component({
  selector: 'app-existing-color-options-button',
  templateUrl: './existing-color-options-button.html',
  styleUrl: './existing-color-options-button.scss',
  imports: [IonButton, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExistingColorOptionsButton {
  private readonly actionSheetController = inject(ActionSheetController);

  colorOptions = input.required<string[]>();
  colorChosen = output<string>();

  openExistingColorOptionsModal(): void {
    from(
      this.actionSheetController.create({
        header: 'Цвета',
        buttons: this.colorOptions().map((color) => ({
          text: color,
          data: color,
        })),
        cssClass: 'colors-sheet-backdrop',
      }),
    )
      .pipe(switchMap((sheet) => from(sheet.present()).pipe(switchMap(() => sheet.onDidDismiss<string>()))))
      .subscribe((result) => {
        if (!result.data) {
          return;
        }
        this.colorChosen.emit(result.data);
      });
  }
}
