import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  authenticated!: 'conceded' | 'denied';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  // ngOnInit() {
  //   this.authService.authenticated$.subscribe((v) => {
  //     console.log(v.authenticated, 'authhhh')
  //     if (v.user.type == 'guest'){
  //       this.router.navigate(['dashboard']);
  //     }
  //     if (v.authenticated == 'conceded'){
  //       this.router.navigate(['dashboard']);
  //     }
  //   });
  // }
}
