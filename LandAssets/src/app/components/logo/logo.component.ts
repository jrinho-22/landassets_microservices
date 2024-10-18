import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.sass'],
  imports: [MatIconModule, CommonModule],
  standalone: true,
})
export class LogoComponent {
  @Input() login: boolean = false;
}
