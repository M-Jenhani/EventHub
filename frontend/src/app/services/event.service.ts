import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, EventRequest, EventCategory } from '../models/models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  createEvent(event: EventRequest): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  updateEvent(id: number, event: EventRequest): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getUpcomingEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/upcoming`);
  }

  getEventsByOrganizer(organizerId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/organizer/${organizerId}`);
  }

  searchEvents(
    category?: EventCategory,
    location?: string,
    startDate?: string,
    endDate?: string
  ): Observable<Event[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    if (location) params = params.set('location', location);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<Event[]>(`${this.apiUrl}/search`, { params });
  }

  searchByKeyword(keyword: string): Observable<Event[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Event[]>(`${this.apiUrl}/search/keyword`, { params });
  }
}
