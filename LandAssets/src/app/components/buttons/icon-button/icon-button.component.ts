import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.sass'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MatTooltipModule]
})
export class IconButtonComponent {
  @Input() icon: string = '';
  @Input() tooltipText: string = ''
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
