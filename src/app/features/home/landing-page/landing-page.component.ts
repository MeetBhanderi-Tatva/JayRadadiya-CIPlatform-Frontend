import { Component, HostListener, OnInit, inject } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { MessageService } from 'primeng/api';
import { IMission } from '../../../core/Interfaces/mission';
import { ButtonModule } from 'primeng/button';
import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule} from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MissionSorting } from '../../../core/Interfaces/mission-sorting';
import { MissionCardComponent } from '../mission-card/mission-card.component';
import { CommonModule } from '@angular/common';
import { MissionCardListComponent } from '../mission-card-list/mission-card-list.component';
import { FilterList } from '../../../core/Interfaces/form-lists';
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
  formBuilder = inject(FormBuilder);

  sortings: MissionSorting[] | any;

  formGroupFilters!: FormGroup;
  getScreenWidth: any;
  activeView: any;
  filterList: FilterList | any;

  userValue: any;

  ngOnInit(): void {
    this.activeView = localStorage.getItem('view') ?? 'grid';
    this.sortings = [
      { id: 1, sorting: 'Newest' },
      { id: 2, sorting: 'Oldest' },
      { id: 3, sorting: 'Lowest available seats' },
      { id: 4, sorting: 'Highest available seats' },
      { id: 5, sorting: 'Sort by my favourite' },
      { id: 6, sorting: 'Sort by deadline' },
    ];
    this.formGroupFilters = this.formBuilder.group({
      searchValue: [''],
      cities: [[]],
      country: [0],
      themes: [[]],
      skills: [[]],
      sortingOption: [1],
    });
    const userInfo = localStorage.getItem('userInfo');
    if(userInfo){
      this.userValue = JSON.parse(userInfo);
    }
    const filters = localStorage.getItem('filters');
    if (filters) {
      const values = JSON.parse(filters);
      this.formGroupFilters.setValue({searchValue : values.searchValue, cities : values.cities, country : values.country, themes : values.themes, skills : values.skills, sortingOption: values.sortingOption});
      this.getMissions(JSON.parse(filters));
    } else {
      this.formGroupFilters.setValue({searchValue : '',cities : [this.userValue.cityId], country : this.userValue.countryId, themes : [], skills : [], sortingOption: 1});
      this.getMissions(this.formGroupFilters.value);
    }
    this.formGroupFilters.valueChanges.subscribe((val) => {
      console.log(val);
      this.getMissions(val);
    });
    this.userService.getAllFilters().subscribe({
      next: (response) => {
        if (response.result) {
          this.filterList = response.data;
          console.log(this.filterList);
        }
      },
    });
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if (window.innerWidth < 992) {
      this.activeView = 'grid';
      localStorage.setItem('view', 'grid');
    }
  }
  setView(view: string) {
    if (this.getScreenWidth < 992) {
      this.activeView = 'grid';
    } else {
      this.activeView = view;
      localStorage.setItem('view', view);
    }
  }

  getMissions(val: any) {
    localStorage.setItem('filters', JSON.stringify(val));
    this.userService
      .getMissions(
        val.searchValue,
        val.country,
        val.cities,
        val.themes,
        val.skills,
        val.sortingOption
      )
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
      
  }
}
