import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Event, EventCategory } from '../../models/models';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = true;
  searchKeyword = '';
  selectedCategory: EventCategory | '' = '';
  selectedLocation = '';
  categories = Object.values(EventCategory);

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredEvents = this.events.filter(event => {
      const matchesKeyword = !this.searchKeyword || 
        event.title.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchKeyword.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || event.category === this.selectedCategory;
      const matchesLocation = !this.selectedLocation || 
        event.location.toLowerCase().includes(this.selectedLocation.toLowerCase());
      
      return matchesKeyword && matchesCategory && matchesLocation;
    });
  }

  clearFilters(): void {
    this.searchKeyword = '';
    this.selectedCategory = '';
    this.selectedLocation = '';
    this.applyFilters();
  }
}
