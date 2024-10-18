import { Component, EventEmitter, Input, Output  } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-flat-button',
  templateUrl: './flat-button.component.html',
  styleUrls: ['./flat-button.component.sass'],
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule, CommonModule, MatTooltipModule],
})
export class FlatButtonComponent {
  @Input() tooltipText: string = ''
  @Input() text: string = '';
  @Input() type: string = 'button';
  @Input() height: string = '40px';
  @Input() class: string | undefined;
  @Input() disabled: boolean = false
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  onClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
    event.stopPropagation(); // Stop propagation if disabled
  }
}
