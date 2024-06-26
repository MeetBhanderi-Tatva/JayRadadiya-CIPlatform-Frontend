import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { IMission } from '../../../core/Interfaces/mission';
import { UserService } from '../../../core/services/user.service';
import { MessageService } from 'primeng/api';
import { FilterList } from '../../../core/Interfaces/form-lists';

@Component({
  selector: 'app-mission-card-list',
  standalone: true,
  imports: [CardModule,RatingModule,ProgressBarModule,ButtonModule,FormsModule],
  templateUrl: './mission-card-list.component.html',
  styleUrl: './mission-card-list.component.css'
})
export class MissionCardListComponent {
  value!: number;
  userService = inject(UserService);
  messageService = inject(MessageService);
  @Input() mission: IMission | any;
  @Input() filterList: FilterList | any;


  toggleFavourite(value: number){
    this.userService.toggleFavourite(
        this.mission.missionId,value
      )
      .subscribe({
        next: (response) => {
          if (response.result) {
            this.mission.favourite = value;
            this.messageService.add({severity:'success', summary:'Success', detail: response.message});
          }
          else{
            this.messageService.add({severity:'error', summary:'Error', detail: response.message});}
        },
        error: (error) => {
          console.error('Error fetching missions:', error);
        },
      });
  }

  getThemeName(themeId: number){
    return this.filterList?.themes.find(
      (option: any) => option.themeId === themeId
    ).themeName
  }
  getCityName(cityId: number){
    return this.filterList?.cities.find(
      (option: any) => option.cityId === cityId
    ).cityName
  }
}
