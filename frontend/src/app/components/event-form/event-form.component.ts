import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EventService } from '../../services/event.service';
import { EventCategory } from '../../models/models';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventId?: number;
  categories = Object.values(EventCategory);
  loading = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      eventDate: ['', [Validators.required]],
      location: ['', [Validators.required]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      category: ['', [Validators.required]],
      posterUrl: [''],
      published: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.eventId = Number(id);
      this.loadEvent();
    }
  }

  loadEvent(): void {
    if (this.eventId) {
      this.eventService.getEventById(this.eventId).subscribe({
        next: (event) => {
          this.eventForm.patchValue({
            ...event,
            eventDate: new Date(event.eventDate)
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.loading = true;
      const formValue = {
        ...this.eventForm.value,
        eventDate: new Date(this.eventForm.value.eventDate).toISOString()
      };

      const request = this.isEditMode && this.eventId
        ? this.eventService.updateEvent(this.eventId, formValue)
        : this.eventService.createEvent(formValue);

      request.subscribe({
        next: () => {
          this.snackBar.open(`Event ${this.isEditMode ? 'updated' : 'created'} successfully!`, 'Close', { duration: 3000 });
          this.router.navigate(['/events']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(error.error?.message || 'Operation failed', 'Close', { duration: 5000 });
        }
      });
    }
  }
}
