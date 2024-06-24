import { Component, HostListener, OnInit, inject } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { MessageService } from 'primeng/api';
import { IMission } from '../../../core/Interfaces/mission';
import { ButtonModule } from 'primeng/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { City } from '../../../core/Interfaces/city';
import { MultiSelectModule } from 'primeng/multiselect';
import { Country } from '../../../core/Interfaces/country';
import { Theme } from '../../../core/Interfaces/theme';
import { Skill } from '../../../core/Interfaces/skill';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MissionSorting } from '../../../core/Interfaces/mission-sorting';
import { MissionCardComponent } from '../mission-card/mission-card.component';
import { CommonModule } from '@angular/common';
import { MissionCardListComponent } from '../mission-card-list/mission-card-list.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    MissionCardComponent,
    MissionCardListComponent,
    ButtonModule,
    FormsModule,
    MultiSelectModule,
    ReactiveFormsModule,
    DropdownModule,
    InputGroupAddonModule,
    InputGroupModule,
    CommonModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit {
  missionList: IMission[] = [];
  userService = inject(UserService);
  messageService = inject(MessageService);
  city!: City[] | undefined;
  theme!: Theme[] | undefined;
  skill!: Skill[] | undefined;
  countries!: Country[] | undefined;
  sortings: MissionSorting[] | undefined;
  formGroupSearch!: FormGroup;
  formGroupLists!: FormGroup;
  formGroupFilter!: FormGroup;
  getScreenWidth: any;
  activeView: any;

  ngOnInit(): void {
    this.activeView = localStorage.getItem('view') ?? 'grid';
    const searchValue = '';
    const country = 0;
    const cities: number[] = [];
    const themes: number[] = [];
    const skills: number[] = [];
    const sortingOption = 1;
    this.countries = [
      { countryId: 1, countryName: 'USA' },
      { countryId: 2, countryName: 'USA' },
      { countryId: 3, countryName: 'USA' },
      { countryId: 4, countryName: 'USA' },
      { countryId: 5, countryName: 'USA' },
    ];
    this.city = [
      { cityId: 1, cityName: 'New York' },
      { cityId: 2, cityName: 'New York' },
      { cityId: 3, cityName: 'New York' },
      { cityId: 4, cityName: 'New York' },
      { cityId: 5, cityName: 'New York' },
    ];
    this.theme = [
      { themeId: 1, themeName: 'Environment' },
      { themeId: 2, themeName: 'Environment' },
      { themeId: 3, themeName: 'Environment' },
      { themeId: 4, themeName: 'Environment' },
      { themeId: 5, themeName: 'Environment' },
    ];
    this.skill = [
      { skillId: 1, skillName: 'Research' },
      { skillId: 2, skillName: 'Research' },
      { skillId: 3, skillName: 'Research' },
    ];
    this.sortings = [
      { Id: 1, Sorting: 'Newest' },
      { Id: 2, Sorting: 'Oldest' },
      { Id: 3, Sorting: 'Lowest available seats' },
      { Id: 4, Sorting: 'Highest available seats' },
      { Id: 5, Sorting: 'Sort by my favourite' },
      { Id: 6, Sorting: 'Sort by deadline' },
    ];
    this.formGroupFilter = new FormGroup({
      selectedSorting: new FormControl<MissionSorting | null>(null),
    });
    this.formGroupSearch = new FormGroup({
      search: new FormControl<string | null>(null),
    });

    this.formGroupLists = new FormGroup({
      selectedCities: new FormControl<City[] | null>(null),
      selectedCountry: new FormControl<Country | null>(null),
      selectedThemes: new FormControl<Theme[] | null>(null),
      selectedSkills: new FormControl<Skill[] | null>(null),
    });
    this.userService
      .getMissions(searchValue, country, cities, themes, skills, sortingOption)
      .subscribe({
        next: (response) => {
          if (response.result) {
            this.missionList = response.data;
          }
        },
        error: (error) => {
          console.error('Error fetching missions:', error);
        },
      });

    // getCities(){
    //   this.userService.getCities(2).subscribe({
    //     next:(response) => {
    //       if(response.result){
    //         console.log(response.data)
    //       this.messageService.add({severity:'success', summary:'Success', detail: response.message});}
    //       else{
    //       this.messageService.add({severity:'error', summary:'Error', detail: response.message});}
    //     },
    //     error:(error) => {
    //       this.messageService.add({severity:'error', summary:'Error', detail: error.message});
    //     }
    //   })
    // }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if(window.innerWidth < 992){
      this.activeView = 'grid';
      localStorage.setItem('view', 'grid');
    }
  }
  setView(view: string) {
    if (this.getScreenWidth < 992) {
      this.activeView = 'grid';
    } else {
      this.activeView = view;
      localStorage.setItem('view',view);
    }
  }
}
