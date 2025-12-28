import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, of } from 'rxjs';
import { catchError, switchMap, startWith, timeout, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BackendStatusService {
  private backendActiveSubject = new BehaviorSubject<boolean>(true);
  backendActive$ = this.backendActiveSubject.asObservable();
  private checking = false;

  constructor(private http: HttpClient) {
    interval(4000)
      .pipe(startWith(0))
      .subscribe(() => {
        this.checkBackend();
      });
  }

  checkBackend() {
    // Show spinner while checking
    this.backendActiveSubject.next(false);
    this.http.get(environment.apiUrl + '/health', { responseType: 'text' })
      .pipe(
        timeout(10000), // 10 seconds timeout
        catchError(() => of(null)),
        finalize(() => {})
      )
      .subscribe((result) => {
        this.backendActiveSubject.next(!!result);
      });
  }
}
