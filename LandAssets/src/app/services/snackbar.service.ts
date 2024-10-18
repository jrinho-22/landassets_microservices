import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { ISnackClass } from '../components/snackbar/ISnackClass';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  panelObj: ISnackClass = { success: 'success-snackbar', error: 'error-snackbar' }
  marginClass = 'margin'

  constructor(private _snackBar: MatSnackBar) { }

  openSnack(config:
    {
      panel: keyof ISnackClass,
      message: string,
      menuMargin?: boolean,
      duration?: number,
      horizontalPosition?: MatSnackBarHorizontalPosition,
      verticalPosition?: MatSnackBarVerticalPosition
    }
  ) {
    var panelClass = []
    panelClass.push(this.panelObj[config.panel])
    config.menuMargin ? panelClass.push(this.marginClass) : undefined

    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: config.duration ? config.duration : 3000,
      data: { message: config.message },
      horizontalPosition: config.horizontalPosition ? config.horizontalPosition : 'end',
      verticalPosition: config.verticalPosition ? config.verticalPosition : 'top',
      panelClass: panelClass
    });
  }
}
