import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventService } from '../../services/event.service';
import { RsvpService } from '../../services/rsvp.service';
import { AuthService } from '../../services/auth.service';
import { Event, RSVP } from '../../models/models';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  event?: Event;
  rsvps: RSVP[] = [];
  userRsvp?: RSVP;
  loading = true;
  isOrganizer = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private rsvpService: RsvpService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvent(id);
    this.loadRSVPs(id);
  }

  loadEvent(id: number): void {
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        const currentUser = this.authService.getCurrentUser();
        this.isOrganizer = currentUser?.id === event.organizerId;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Event not found', 'Close', { duration: 3000 });
        this.router.navigate(['/events']);
      }
    });
  }

  loadRSVPs(id: number): void {
    this.rsvpService.getEventRSVPs(id).subscribe({
      next: (rsvps) => {
        this.rsvps = rsvps;
        const currentUser = this.authService.getCurrentUser();
        this.userRsvp = rsvps.find(r => r.userId === currentUser?.id);
      }
    });
  }

  joinEvent(): void {
    if (!this.event) return;
    
    this.rsvpService.createRSVP(this.event.id).subscribe({
      next: (rsvp) => {
        this.snackBar.open(`Successfully ${rsvp.status === 'CONFIRMED' ? 'joined' : 'added to waitlist for'} event!`, 'Close', { duration: 3000 });
        this.loadEvent(this.event!.id);
        this.loadRSVPs(this.event!.id);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to join event', 'Close', { duration: 3000 });
      }
    });
  }

  leaveEvent(): void {
    if (!this.event) return;
    
    this.rsvpService.cancelRSVP(this.event.id).subscribe({
      next: () => {
        this.snackBar.open('Successfully left event', 'Close', { duration: 3000 });
        this.loadEvent(this.event!.id);
        this.loadRSVPs(this.event!.id);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to leave event', 'Close', { duration: 3000 });
      }
    });
  }

  editEvent(): void {
    if (this.event) {
      this.router.navigate(['/events/edit', this.event.id]);
    }
  }

  deleteEvent(): void {
    if (!this.event) return;
    
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(this.event.id).subscribe({
        next: () => {
          this.snackBar.open('Event deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/events']);
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Failed to delete event', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
