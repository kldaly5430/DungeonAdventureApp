import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TimerComponent } from '../../components/timer/timer.component';
import { RosterComponent } from '../roster/roster.component';
import { HeaderComponent } from "../../navigation/header/header.component";

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
  imports: [TimerComponent, RosterComponent, CommonModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  adventurers: Adventurer[] = [];
  noAdventurers: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAdventurers();
  }

  onTimerEnd() {
    this.generateAdventurers();
  }

  generateAdventurers() {
    console.log('Generating roster');
    const params = {
      defenders: 20,
      attackers: 35,
      healer: 10
    };

    this.http.get<Adventurer>('http://localhost:3000/api/adventurers/generate')
    .subscribe(adventurer => {
      this.adventurers.push(adventurer);
    }, error => {
      console.error("Error fetching adventurer:", error);
    });
  }

  loadAdventurers() {
    this.http.get<Adventurer[]>('http://localhost:3000/api/adventurers/getAdventurers')
    .subscribe(data => {
      this.adventurers = data.length > 0 ? data : [];
      if(this.adventurers.length !== 0) {
        console.log(this.adventurers[0].name);
        this.noAdventurers = false;
      } else {
        this.noAdventurers = true;
      }
    }, error => {
      console.error("Error fetching adventurers:", error);
      this.noAdventurers = true;
    });
  }
}
