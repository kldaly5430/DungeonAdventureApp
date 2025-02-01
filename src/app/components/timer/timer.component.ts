import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TimerService } from '../../services/timer.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent implements OnInit {
  @Output() timerEnded = new EventEmitter<void>();

  remainingTime: number = 0;
  startTime!: string;
  endTime!: string;
  timerRunning: boolean = false;
  private timerSubscription!: Subscription;

  constructor(private timerService: TimerService, private http: HttpClient) {}

  ngOnInit() {
    this.getTimerFromDatabase();
    // console.log(this.remainingTime);
    this.timerSubscription = interval(1000).subscribe(() => this.updateTimer());
  }

  getTimerFromDatabase() {
    this.http.get<{ start_time: string, end_time: string }>('http://localhost:3000/api/timer/getTimer')
      .subscribe(timer => {
        this.startTime = timer.start_time;
        this.endTime = timer.end_time;
        this.checkAndStartTimer();
      }, error => {
        console.error("Error fetching timer", error);
      });
  }

  checkAndStartTimer() {
    if (!this.startTime || !this.endTime) {
      console.error("Timer start_time or end_time is undefined");
      return;
    }

    const now = new Date().getTime();
    const start = new Date(this.startTime).getTime();
    const end = new Date(this.endTime).getTime();

    if (now >= start && now <= end) {
      this.remainingTime = Math.floor((end - now) / 1000);
      this.timerRunning = true;
    } else {
      this.remainingTime = 0;
      this.timerRunning = false;
    }
  }

  startTimer() {
    this.timerService.startTimer(this.startTime, this.endTime).subscribe(response => {
      this.remainingTime = response.remainingTime;
      this.timerRunning = true;
    });
    
  }

  stopTimer() {
    this.timerService.stopTimer().subscribe(response => {
      this.remainingTime = response.remainingTime;
      this.timerRunning = false;
    })
  }

  updateTimer() {
    if (this.timerRunning && this.remainingTime > 0) {
      this.remainingTime--;
      if (this.remainingTime === 0) {
        this.timerRunning = false;
        console.log("Timer ended, emitting event...");
        this.timerEnded.emit();
      }
    }
  }

  get formattedTime(): string {
    const days = Math.floor(this.remainingTime/(24*3600));
    const hours = Math.floor((this.remainingTime%(24*3600))/3600);
    const minutes = Math.floor((this.remainingTime%3600)/60);
    const seconds = this.remainingTime%60;

    return `Days: ${days} Hours: ${hours.toString().padStart(2, '0')} Minutes: ${minutes.toString().padStart(2, '0')} Seconds: ${seconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
