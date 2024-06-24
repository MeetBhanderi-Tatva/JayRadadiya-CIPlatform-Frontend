import { Component, Input } from '@angular/core';
import { IMission } from '../../../core/Interfaces/mission';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mission-card',
  standalone: true,
  imports: [CardModule,RatingModule,ProgressBarModule,ButtonModule,FormsModule],
  templateUrl: './mission-card.component.html',
  styleUrl: './mission-card.component.css'
})
export class MissionCardComponent {
  value!: number;
  @Input() mission: IMission | any;
}
