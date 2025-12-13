import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RSVP } from '../models/models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RsvpService {
  private apiUrl = `${environment.apiUrl}/rsvps`;

  constructor(private http: HttpClient) {}

  createRSVP(eventId: number): Observable<RSVP> {
    return this.http.post<RSVP>(`${this.apiUrl}/events/${eventId}`, {});
  }

  cancelRSVP(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/events/${eventId}`);
  }

  getMyRSVPs(): Observable<RSVP[]> {
    return this.http.get<RSVP[]>(`${this.apiUrl}/my-rsvps`);
  }

  getEventRSVPs(eventId: number): Observable<RSVP[]> {
    return this.http.get<RSVP[]>(`${this.apiUrl}/events/${eventId}`);
  }
}
