import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { User, DashboardStats, Event } from '../../models/models';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  stats?: DashboardStats;
  users: User[] = [];
  events: Event[] = [];
  displayedColumns = ['id', 'name', 'email', 'role', 'actions'];

  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('eventsChart') eventsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rsvpChart') rsvpChartRef!: ElementRef<HTMLCanvasElement>;

  private categoryChart?: Chart;
  private eventsChart?: Chart;
  private rsvpChart?: Chart;

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
    this.loadEvents();
  }

  ngAfterViewInit(): void {
    // Charts will be created after events are loaded
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        setTimeout(() => this.createCharts(), 0);
      }
    });
  }

  loadStats(): void {
    this.userService.getAdminStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      }
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      }
    });
  }

  deleteUser(userId: number): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id === userId) {
      this.snackBar.open('Cannot delete your own account', 'Close', { duration: 3000 });
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
        }
      });
    }
  }

  private createCharts(): void {
    this.createCategoryChart();
    this.createEventsChart();
    this.createRsvpChart();
  }

  private createCategoryChart(): void {
    if (!this.categoryChartRef) return;

    // Count events by category
    const categoryCounts: { [key: string]: number } = {};
    this.events.forEach(event => {
      categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1;
    });

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: Object.keys(categoryCounts),
        datasets: [{
          data: Object.values(categoryCounts),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Events by Category'
          }
        }
      }
    };

    this.categoryChart = new Chart(this.categoryChartRef.nativeElement, config);
  }

  private createEventsChart(): void {
    if (!this.eventsChartRef || !this.stats) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['Upcoming', 'Past', 'Total'],
        datasets: [{
          label: 'Events',
          data: [this.stats.upcomingEvents, this.stats.pastEvents, this.stats.totalEvents],
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Events Overview'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    };

    this.eventsChart = new Chart(this.eventsChartRef.nativeElement, config);
  }

  private createRsvpChart(): void {
    if (!this.rsvpChartRef) return;

    // Calculate average attendees per event
    const totalAttendees = this.events.reduce((sum, event) => sum + event.attendeeCount, 0);
    const avgAttendees = this.events.length > 0 ? Math.round(totalAttendees / this.events.length) : 0;

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: ['Total RSVPs', 'Average per Event'],
        datasets: [{
          data: [this.stats?.totalRSVPs || 0, avgAttendees],
          backgroundColor: ['#4BC0C0', '#FF9F40']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'RSVP Statistics'
          }
        }
      }
    };

    this.rsvpChart = new Chart(this.rsvpChartRef.nativeElement, config);
  }

  ngOnDestroy(): void {
    this.categoryChart?.destroy();
    this.eventsChart?.destroy();
    this.rsvpChart?.destroy();
  }
}
