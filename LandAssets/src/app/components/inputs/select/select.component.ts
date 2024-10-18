import {Component, EventEmitter, Input, Output, SimpleChanges, ViewEncapsulation, NgZone } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.sass'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
})

export class SelectComponent<T> {
  @Input() placeholder: string = "Select a option"
  @Input() disabled: boolean = false
  @Input() value: string = 'value'
  @Input() label: string = 'label'
  @Input() syncValue: Object | false | undefined = {}
  @Input() options: T[] = [] 

  @Output() dataEvent = new EventEmitter();
  @Output() erase = new EventEmitter();

  selectedValue: any = undefined;

  constructor(private zone: NgZone) { }

  sendData() {
    this.dataEvent.emit(this.selectedValue);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.syncValue) { 
      this.zone.run(() => {
        setTimeout(() => {
         this.selectedValue = changes['syncValue'].currentValue[this.value];
        }, 0);
      });
    } 
    if (this.syncValue == undefined) {
      this.zone.run(() => {
        setTimeout(() => {
          this.selectedValue = changes['syncValue'].currentValue
        }, 0);
      });
    }
  }
}