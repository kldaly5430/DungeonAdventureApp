import { Component } from '@angular/core';
import { TimerComponent } from '../../components/timer/timer.component';
import { RosterComponent } from '../roster/roster.component';

interface Adventurer {
  id: number;
  image: string;
  name: string;
  role: string;
  hp: number;
  stamina: number;
  power: number;
  damage: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TimerComponent, RosterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  adventurers: Adventurer[] = [];

  onTimerEnd() {
    this.generateAdventurers();
  }

  generateAdventurers() {

  }

}
