import { Component, HostListener, OnInit, inject } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { MessageService } from 'primeng/api';
import { IMission } from '../../../core/Interfaces/mission';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MissionSorting } from '../../../core/Interfaces/mission-sorting';
import { MissionCardComponent } from '../mission-card/mission-card.component';
import { CommonModule } from '@angular/common';
import { MissionCardListComponent } from '../mission-card-list/mission-card-list.component';
import { ActiveFilter, FilterList } from '../../../core/Interfaces/form-lists';
import { DialogService } from '../../../core/services/dialog.service';
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
  dialogService = inject(DialogService);
  formBuilder = inject(FormBuilder);

  sortings: MissionSorting[] | any;

  formGroupFilters!: FormGroup;
  getScreenWidth: any;
  activeView: any;
  filterList: FilterList | any;

  activeFilter: ActiveFilter[] = [];
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

    this.userService.getAllFilters().subscribe({
      next: (response) => {
        if (response.result) {
          this.filterList = response.data;
          console.log(this.filterList);
          this.setFilterValues();
        }
      },
    });

    this.formGroupFilters.valueChanges.subscribe((val) => {
      console.log(val);
      this.getMissions(val);
    });
  }

  setFilterValues(): void {
    const filterTags = localStorage.getItem('filterTags');
    if (filterTags) {
      this.activeFilter = JSON.parse(filterTags);
    }
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.userValue = JSON.parse(userInfo);
    }

    const filters = localStorage.getItem('filters');
    if (filters) {
      const values = JSON.parse(filters);
      this.formGroupFilters.setValue({
        searchValue: values.searchValue,
        cities: values.cities,
        country: values.country,
        themes: values.themes,
        skills: values.skills,
        sortingOption: values.sortingOption,
      });
      this.getMissions(JSON.parse(filters));
    } else {
      this.formGroupFilters.setValue({
        searchValue: '',
        cities: [this.userValue.cityId],
        country: this.userValue.countryId,
        themes: [],
        skills: [],
        sortingOption: 1,
      });
      const formValues = this.formGroupFilters.value;
      this.activeFilter.push({
        type: 'country',
        value: formValues.country,
        label: this.filterList?.countries.find(
          (option: any) => option.countryId === formValues.country
        ).countryName,
      });
      formValues.cities.forEach((item: any) => {
        this.activeFilter.push({
          type: 'city',
          value: item,
          label: this.filterList?.cities.find(
            (option: any) => option.cityId === item
          ).cityName,
        });
      });

      console.log(this.activeFilter);
      this.getMissions(formValues);
    }
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
    localStorage.setItem('filterTags', JSON.stringify(this.activeFilter));
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

  onCountryChange(event: any): void {
    const countryId = event.value;
    this.activeFilter = this.activeFilter.filter(function (obj) {
      return obj.type !== 'country';
    });
    this.activeFilter.push({
      type: 'country',
      value: countryId,
      label: this.filterList?.countries.find(
        (option: any) => option.countryId === countryId
      ).countryName,
    });
    console.log(this.activeFilter);
    localStorage.setItem('filterTags', JSON.stringify(this.activeFilter));

  }
  onChangeCity(event: any) {
    const cityId = event.itemValue.cityId;
    if (
      this.activeFilter.find(
        (option: any) => option.type === 'city' && option.value === cityId
      )
    ) {
      this.activeFilter = this.activeFilter.filter(function (obj) {
        return obj.type !== 'city' ? true :  obj.value !== cityId;
      });
    } else {
      this.activeFilter.push({
        type: 'city',
        value: cityId,
        label: this.filterList?.cities.find(
          (option: any) => option.cityId === cityId
        ).cityName,
      });
    }
    console.log(this.activeFilter);
    localStorage.setItem('filterTags', JSON.stringify(this.activeFilter));

  }
  onChangeTheme(event: any) {
    const themeId = event.itemValue.themeId;
    if (
      this.activeFilter.find(
        (option: any) => option.type === 'theme' && option.value === themeId
      )
    ) {
      this.activeFilter = this.activeFilter.filter(function (obj) {
        return obj.type !== 'theme' ? true : obj.value !== themeId;
      });
    } else {
      this.activeFilter.push({
        type: 'theme',
        value: themeId,
        label: this.filterList?.themes.find(
          (option: any) => option.themeId === themeId
        ).themeName,
      });
    }
    console.log(this.activeFilter);
    localStorage.setItem('filterTags', JSON.stringify(this.activeFilter));

  }
  onChangeSkill(event: any) {
    const skillId = event.itemValue.skillId;
    if (
      this.activeFilter.find(
        (option: any) => option.type === 'skill' && option.value === skillId
      )
    ) {
      this.activeFilter = this.activeFilter.filter(function (obj) {
        return obj.type !== 'skill' ? true : obj.value !== skillId;
      });
    } else {
      this.activeFilter.push({
        type: 'skill',
        value: skillId,
        label: this.filterList?.skills.find(
          (option: any) => option.skillId === skillId
        ).skillName,
      });
    }
    console.log(this.activeFilter);
    localStorage.setItem('filterTags', JSON.stringify(this.activeFilter));

  }

  clearFilter(type: string, value: number){
    console.log(type,value);
      if (type === 'city') {
      const cities = this.formGroupFilters.get('cities')?.value.filter((val:any) => val !== value);
      this.formGroupFilters.get('cities')?.setValue(cities);
      this.activeFilter = this.activeFilter.filter(function (obj) {
        return obj.type !== 'city' ? true :  obj.value !== value;
      });
    } else if (type === 'theme') {
      const themes = this.formGroupFilters.get('themes')?.value.filter((val:any) => val !== value);
      this.formGroupFilters.get('themes')?.setValue(themes);
      this.activeFilter = this.activeFilter.filter(function (obj) {
        return obj.type !== 'theme' ? true :  obj.value !== value;
      });
    } else if (type === 'skill') {
      const skills = this.formGroupFilters.get('skills')?.value.filter((val:any) => val !== value);
      this.formGroupFilters.get('skills')?.setValue(skills);
      this.activeFilter = this.activeFilter.filter(function (obj) {
        return obj.type !== 'skill' ? true :  obj.value !== value;
      });
    }
  }

  clearAllFilter(){
    this.activeFilter = this.activeFilter.filter(function (obj) {
      return obj.type === 'country';
    });
    const countryId = this.formGroupFilters.value?.country;
    this.formGroupFilters.setValue({
      searchValue: '',
      cities: [],
      country: countryId,
      themes: [],
      skills: [],
      sortingOption: 1,
    });
  }

  openDialog() {
    this.dialogService.triggerOpenDialog();
  }
}
