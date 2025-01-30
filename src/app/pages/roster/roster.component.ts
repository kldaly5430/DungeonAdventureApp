import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  selector: 'app-roster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roster.component.html',
  styleUrl: './roster.component.css'
})
export class RosterComponent {
  @Input() adventurers: Adventurer[] = [];

  constructor() {
    this.initializeAdventurer();
  }

  initializeAdventurer(): void {
    const sampleAdventurer: Adventurer = {
      id: 1,
      image: 'images/fighter01.png',
      name: 'Sample Fighter',
      role: 'Fighter',
      hp: 100,
      stamina: 100,
      power: 100,
      damage: 50
    };

    this.adventurers.push(sampleAdventurer);
  }

  ngInit(): void {
    // this.initializeAdventurer();
  }
}
