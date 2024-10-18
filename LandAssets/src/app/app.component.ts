import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  authenticated!: 'conceded' | 'denied' | null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.authenticated$.subscribe((v) => {
      this.authenticated = v.authenticated;
    });
  }
}
