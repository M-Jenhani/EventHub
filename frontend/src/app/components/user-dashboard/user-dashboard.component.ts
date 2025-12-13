import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EventService } from '../../services/event.service';
import { RsvpService } from '../../services/rsvp.service';
import { AuthService } from '../../services/auth.service';
import { Event, RSVP } from '../../models/models';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  myEvents: Event[] = [];
  myRSVPs: RSVP[] = [];
  upcomingEvents: Event[] = [];

  constructor(
    private eventService: EventService,
    private rsvpService: RsvpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.eventService.getEventsByOrganizer(user.id).subscribe({
        next: (events) => {
          this.myEvents = events;
        }
      });

      this.rsvpService.getMyRSVPs().subscribe({
        next: (rsvps) => {
          this.myRSVPs = rsvps;
        }
      });

      this.eventService.getUpcomingEvents().subscribe({
        next: (events) => {
          this.upcomingEvents = events.slice(0, 5);
        }
      });
    }
  }
}
