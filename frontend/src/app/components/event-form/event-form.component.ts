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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { EventService } from '../../services/event.service';
import { FileUploadService } from '../../services/file-upload.service';
import { EventCategory } from '../../models/models';
import { environment } from '../../../environments/environment';

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
    MatSnackBarModule,
    MatProgressBarModule,
    MatIconModule
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
  minDate = new Date(); // Minimum date is today
  
  // File upload
  uploadProgress = 0;
  isUploading = false;
  posterPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private fileUploadService: FileUploadService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      eventDate: ['', [Validators.required]],
      eventTime: ['', [Validators.required]],
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
          const eventDate = new Date(event.eventDate);
          const hours = String(eventDate.getHours()).padStart(2, '0');
          const minutes = String(eventDate.getMinutes()).padStart(2, '0');
          
          this.eventForm.patchValue({
            ...event,
            eventDate: eventDate,
            eventTime: `${hours}:${minutes}`
          });
          // Set poster preview if exists
          if (event.posterUrl) {
            this.posterPreview = this.getFullPosterUrl(event.posterUrl);
          }
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const file = input.files[0];
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.snackBar.open('Invalid file type. Please upload an image (JPG, PNG, GIF, WebP)', 'Close', { duration: 5000 });
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      this.snackBar.open('File too large. Maximum size is 5MB', 'Close', { duration: 5000 });
      return;
    }
    
    this.isUploading = true;
    this.uploadProgress = 0;
    
    this.fileUploadService.uploadFile(file).subscribe({
      next: (progress) => {
        this.uploadProgress = progress.progress;
        if (progress.completed && progress.url) {
          this.eventForm.patchValue({ posterUrl: progress.url });
          this.posterPreview = this.getFullPosterUrl(progress.url);
          this.isUploading = false;
          this.snackBar.open('Image uploaded successfully!', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        this.isUploading = false;
        this.uploadProgress = 0;
        const errorMessage = error.error?.message || 'Failed to upload image';
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
      }
    });
  }

  removePoster(): void {
    this.eventForm.patchValue({ posterUrl: '' });
    this.posterPreview = null;
  }

  getFullPosterUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    // URL is like /files/filename, apiUrl is http://localhost:8080/api
    return `${environment.apiUrl}${url}`;
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.loading = true;
      
      // Combine date and time
      const date = new Date(this.eventForm.value.eventDate);
      const [hours, minutes] = this.eventForm.value.eventTime.split(':');
      
      // Check if selected date is today
      const today = new Date();
      const isToday = date.getFullYear() === today.getFullYear() &&
                      date.getMonth() === today.getMonth() &&
                      date.getDate() === today.getDate();
      
      // If today, validate that time is not in the past
      if (isToday) {
        const selectedTime = parseInt(hours) * 60 + parseInt(minutes);
        const currentTime = today.getHours() * 60 + today.getMinutes();
        
        if (selectedTime <= currentTime) {
          this.loading = false;
          this.snackBar.open('Please select a future time for today\'s event', 'Close', { duration: 5000 });
          return;
        }
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const localISOString = `${year}-${month}-${day}T${hours}:${minutes}:00`;
      
      const formValue = {
        ...this.eventForm.value,
        eventDate: localISOString
      };
      delete formValue.eventTime;

      const request = this.isEditMode && this.eventId
        ? this.eventService.updateEvent(this.eventId, formValue)
        : this.eventService.createEvent(formValue);

      request.subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open(`Event ${this.isEditMode ? 'updated' : 'created'} successfully!`, 'Close', { duration: 3000 });
          this.router.navigate(['/events']);
        },
        error: (error) => {
          this.loading = false;
          const errorMessage = error.error?.message || error.error?.error || 'Operation failed. Please check your input.';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      });
    }
  }
}
