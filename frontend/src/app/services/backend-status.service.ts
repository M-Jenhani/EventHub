import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, of } from 'rxjs';
import { catchError, switchMap, startWith } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BackendStatusService {
  private backendActiveSubject = new BehaviorSubject<boolean>(true);
  backendActive$ = this.backendActiveSubject.asObservable();

  constructor(private http: HttpClient) {
    interval(4000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.http.get(environment.apiUrl + '/health', { responseType: 'text' }).pipe(
            catchError(() => of(null))
          )
        )
      )
      .subscribe((result) => {
        this.backendActiveSubject.next(!!result);
      });
  }
}
