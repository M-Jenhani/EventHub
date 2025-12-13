import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.loadTheme());
  public darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.applyTheme(this.darkModeSubject.value);
  }

  toggleTheme(): void {
    const isDark = !this.darkModeSubject.value;
    this.darkModeSubject.next(isDark);
    this.saveTheme(isDark);
    this.applyTheme(isDark);
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  private loadTheme(): boolean {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  }

  private saveTheme(isDark: boolean): void {
    localStorage.setItem('darkMode', String(isDark));
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
