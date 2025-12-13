import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { WebsocketService } from './services/websocket.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'EventHub';
  unreadCount = 0;

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private websocketService: WebsocketService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.websocketService.connect(user.email);
        this.loadUnreadCount();
      } else {
        this.websocketService.disconnect();
      }
    });

    this.websocketService.notification$.subscribe(notification => {
      if (notification) {
        this.loadUnreadCount();
      }
    });
  }

  loadUnreadCount(): void {
    this.notificationService.getUnreadNotifications().subscribe({
      next: (notifications) => {
        this.unreadCount = notifications.length;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  navigateToDashboard(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
