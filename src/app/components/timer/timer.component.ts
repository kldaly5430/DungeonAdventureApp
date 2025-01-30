import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
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
  startTime: string = '2025-01-01T00:00:00';
  endTime: string = '2025-01-01T01:00:00';
  timerRunning: boolean = false;
  private timerSubscription!: Subscription;
  private localTimer!: Subscription;

  constructor(private timerService: TimerService) {}

  ngOnInit() {
    this.updateTimer();
    this.startPolling();
  }

  startPolling() {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateTimer();
    })
  }

  startTimer() {
    this.timerService.startTimer(this.startTime, this.endTime).subscribe(response => {
      this.remainingTime = response.remainingTime;
      this.timerRunning = true;
      this.startLocalTimer();
    });
    
  }

  startLocalTimer() {
    // Update the timer in the frontend every second for smoother UI updates
    this.localTimer = interval(1000).subscribe(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      }
      if(this.remainingTime === 0) {
        this.timerRunning = false;
        this.timerEnded.emit();
        this.localTimer.unsubscribe();
      }
    });
  }

  stopTimer() {
    this.timerService.stopTimer().subscribe(response => {
      this.remainingTime = response.remainingTime;
      this.timerRunning = false;
      if (this.localTimer) {
        this.localTimer.unsubscribe(); // Stop local countdown
      }
    });
  }

  updateTimer() {
    this.timerService.gettimerValue().subscribe(response => {
      this.remainingTime = response.remainingTime;
      this.timerRunning = response.timerRunning;

      if(this.timerRunning) {
        this.startLocalTimer();
      }
    });
  }

  setTimer() {
    this.timerService.setTimer(this.startTime, this.endTime).subscribe(response => {
      this.remainingTime = response.remainingTime;
    });
  }

  ngOnDestroy() {
    if(this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.localTimer) {
      this.localTimer.unsubscribe();
    }
  }
}
