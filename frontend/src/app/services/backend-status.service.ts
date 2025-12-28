import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, of, race, timer } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export type BackendStatus = 'loading' | 'active' | 'inactive';

@Injectable({ providedIn: 'root' })
export class BackendStatusService {
  private backendStatusSubject = new BehaviorSubject<BackendStatus>('active');
  backendStatus$ = this.backendStatusSubject.asObservable();

  constructor(private http: HttpClient) {
    interval(4000)
      .pipe()
      .subscribe(() => {
        // Only set to loading if not already active
        if (this.backendStatusSubject.value !== 'active') {
          this.backendStatusSubject.next('loading');
        }
        race([
          this.http.get(environment.apiUrl + '/health', { responseType: 'text' }).pipe(
            map(() => 'active' as BackendStatus),
            catchError(() => of('inactive' as BackendStatus))
          ),
          timer(2500).pipe(map(() => 'inactive' as BackendStatus))
        ])
        .subscribe((status) => {
          this.backendStatusSubject.next(status);
        });
      });
  }
}
