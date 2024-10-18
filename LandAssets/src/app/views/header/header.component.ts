import { Component, HostListener } from '@angular/core';
import menuItems from './menuItems';
import { IMenuItems } from './interfaceMenuItems';
import { NavigationEnd, Router, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/interfaces/IUser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent {
  shouldScroll: boolean = true
  isScrolledDown: boolean = false;
  hoverItem: string = '';
  hoverChildrenItem: string = '';
  items: IMenuItems[] = menuItems;
  routerSubscription!: Subscription;
  user: IUser | null = null;

  constructor(private router: Router, private authService: AuthService) { }

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
    const admin = this.user?.admin
    if (permission == 'all') return true
    if (permission == 'admin' && admin) return true    
    if (permission == 'client' && !admin) return true
    return false
  }

  ngOnInit() {
    this.checkPath()
    this.authService.authenticated$.subscribe((v) => {
      this.user = v.user;
    });
    this.routerSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.checkPath(event);
      }
    });
  }

  private checkPath(event?: NavigationEnd) {
    const url = event ? event.url : this.router.url;
    this.shouldScroll = url.includes('dashboard');
    this.isScrolledDown = !url.includes('dashboard');
  }

  logout() {
    localStorage.removeItem('token');
    window.location.reload();
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
