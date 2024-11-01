import { Component, HostListener } from '@angular/core';
import menuItems from './menuItems';
import { IMenuItems } from './interfaceMenuItems';
import { NavigationEnd, Router, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import IUser, { IUserGuest } from 'src/app/interfaces/IUser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent {
  shouldScroll: boolean = true
  shouldShow: boolean = true
  isScrolledDown: boolean = false;
  hoverItem: string = '';
  hoverChildrenItem: string = '';
  items: IMenuItems[] = menuItems;
  routerSubscription!: Subscription;
  user!: IUser | IUserGuest;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.authenticated$.subscribe((v) => {
      this.user = v.user;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.shouldScroll) {
      this.isScrolledDown =
        (window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0) > 5;
    }
  }

  allowMenuItem({permission}: IMenuItems){
    if (permission.includes('all')) return true 

    let type: 'admin' | 'client' | 'guest' = this.user.type
    if (permission.includes(type)) return true  
    return false
  }

  ngOnInit() {
    this.checkPath()
    this.routerSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.checkPath(event);
      }
    });
  }

  private checkPath(event?: NavigationEnd) {
    const url = event ? event.url : this.router.url;
    this.shouldScroll = url.includes('dashboard');
    this.shouldShow = !url.split('/').includes('login');
    this.isScrolledDown = !url.includes('dashboard');
  }

  logAction() {
    if (this.user.type == 'guest') {
      this.router.navigate(['login']);
    } else {
      localStorage.removeItem('token');
      window.alert("Logout Successful")
      this.router.navigate(['dashboard']);
    }
  }

  logText() {
    if (this.user.type == 'guest') {
      return 'LOGIN'
    } else {
      return 'LOGOUT'
    }
  }

  onMouseLeave() {
    this.hoverItem = '';
  }

  onMouseLeaveGran() {
    this.hoverChildrenItem = '';
  }

  onMouseEnter(item: string) {
    this.hoverItem = item;
  }

  onMouseEnterGran(item: string) {
    this.hoverChildrenItem = item;
  }

  navigate(path: string | undefined) {
    path ? this.router.navigate([path]) : undefined;
    this.onMouseLeave()
  }
}
