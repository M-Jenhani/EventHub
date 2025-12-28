import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { WebsocketService } from './services/websocket.service';
import { NotificationService } from './services/notification.service';
import { Notification, NotificationType } from './models/models';
import { BackendStatusService } from './services/backend-status.service';
import { BackendWakeupMessageComponent } from './components/backend-wakeup-message/backend-wakeup-message.component';

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
    MatBadgeModule,
    MatDividerModule,
    BackendWakeupMessageComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'EventHub';
  unreadCount = 0;
  notifications: Notification[] = [];
  hoverNotification: Notification | null = null;
  backendActive = true;

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private websocketService: WebsocketService,
    private notificationService: NotificationService,
    private router: Router,
    private backendStatusService: BackendStatusService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.websocketService.connect(user.email);
        this.loadNotifications();
      } else {
        this.websocketService.disconnect();
        this.notifications = [];
        this.unreadCount = 0;
      }
    });

    this.websocketService.notification$.subscribe(notification => {
      if (notification) {
        this.loadNotifications();
      }
    });

    this.backendStatusService.backendActive$.subscribe(active => {
      this.backendActive = active;
    });
  }

  loadNotifications(): void {
    this.notificationService.getUserNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications.map(notification => ({
          ...notification,
          read: notification.read || false // Ensure `read` is always a boolean
        })).slice(0, 10); // Show last 10
        this.unreadCount = this.notifications.filter(n => !n.read).length;
      },
      error: (err) => {
        console.error('Failed to load notifications:', err);
      }
    });
  }

  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.RSVP_CONFIRMED:
        return 'check_circle';
      case NotificationType.RSVP_WAITLIST:
        return 'schedule';
      case NotificationType.EVENT_UPDATE:
        return 'update';
      case NotificationType.EVENT_CANCELLED:
        return 'cancel';
      case NotificationType.WAITLIST_PROMOTED:
        return 'arrow_upward';
      case NotificationType.EVENT_REMINDER:
        return 'alarm';
      default:
        return 'notifications';
    }
  }

  onNotificationClick(notification: Notification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.read = true;
          this.unreadCount = this.notifications.filter(n => !n.read).length;
        },
        error: (err) => {
          console.error('Failed to mark notification as read:', err);
        }
      });
    }
    if (notification.relatedEventId) {
      this.router.navigate(['/events', notification.relatedEventId]);
    }
  }

  markAllRead(event: Event): void {
    event.stopPropagation();
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
      },
      error: (err) => {
        console.error('Failed to mark all notifications as read:', err);
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
