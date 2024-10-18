import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import ISnackBarData from 'src/app/interfaces/ISnackBarData';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class SnackbarComponent {
  values!: ISnackBarData
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: ISnackBarData,
  ) {}

  ngOnInit() {
    this.values = this.data 
  }
}
