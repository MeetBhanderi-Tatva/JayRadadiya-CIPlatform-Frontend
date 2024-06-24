import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { IMission } from '../../../core/Interfaces/mission';

@Component({
  selector: 'app-mission-card-list',
  standalone: true,
  imports: [CardModule,RatingModule,ProgressBarModule,ButtonModule,FormsModule],
  templateUrl: './mission-card-list.component.html',
  styleUrl: './mission-card-list.component.css'
})
export class MissionCardListComponent {
  value!: number;
  @Input() mission: IMission | any;
}
