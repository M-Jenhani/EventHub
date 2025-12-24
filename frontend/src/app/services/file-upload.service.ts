import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FileUploadResponse {
  filename: string;
  url: string;
}

export interface UploadProgress {
  progress: number;
  filename?: string;
  url?: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = `${environment.apiUrl}/files`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<UploadProgress> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<FileUploadResponse>(`${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<FileUploadResponse>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progressEvent = event as HttpProgressEvent;
            const progress = progressEvent.total 
              ? Math.round((100 * progressEvent.loaded) / progressEvent.total)
              : 0;
            return { progress, completed: false };
          
          case HttpEventType.Response:
            const response = event as HttpResponse<FileUploadResponse>;
            return {
              progress: 100,
              filename: response.body?.filename,
              url: response.body?.url,
              completed: true
            };
          
          default:
            return { progress: 0, completed: false };
        }
      }),
      catchError(error => {
        console.error('Upload error:', error);
        return throwError(() => error);
      })
    );
  }

  deleteFile(filename: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${filename}`);
  }

  getFileUrl(filename: string): string {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename;
    return `${environment.apiUrl}/files/${filename}`;
  }
}
