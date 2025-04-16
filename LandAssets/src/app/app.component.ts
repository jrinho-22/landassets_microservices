import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ["./app.component.sass"],
})
export class AppComponent {
  authenticated!: 'conceded' | 'denied';
  loading = true

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  getLoading() {
    if (
      AuthService._connected.auth || AuthService._connected.sales || AuthService._connected.service1
    ) return false
    return true
  }

  // ngOnInit() {
  //   this.authService.authenticated$.subscribe((v) => {
  //     console.log(v.authenticated, 'authhhh')
  //     if (v.user.type == 'guest') {
  //       this.router.navigate(['dashboard']);
  //     }
  //     if (v.authenticated == 'conceded') {
  //       this.router.navigate(['dashboard']);
  //     }
  //   });
  // }
}
