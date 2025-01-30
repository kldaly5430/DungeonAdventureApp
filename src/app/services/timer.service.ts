import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private apiUrl = 'http://localhost:3000/api/timer';

  constructor(private http: HttpClient) { }

  startTimer(startTime: string, endTime: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/start`, { start: startTime, end: endTime });
  }

  stopTimer(): Observable<any> {
    return this.http.post(`${this.apiUrl}/stop`, {});
  }

  gettimerValue(): Observable<any> {
    return this.http.post(`${this.apiUrl}/time`, {});
  }

  setTimer(startTime: string, endTime: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/set`, { start: startTime, end: endTime });
  }
}
