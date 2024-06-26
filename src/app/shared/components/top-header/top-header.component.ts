import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { MenuItem, MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormLists } from '../../../core/Interfaces/form-lists';
import { DropdownModule } from 'primeng/dropdown';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { MissionTypeEnum, enumToKeyValueArray } from '../../Enums/global-enums';
import { DialogService } from '../../../core/services/dialog.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-top-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    RouterLink,
    MenubarModule,
    AvatarModule,
    TieredMenuModule,
    SidebarModule,
    BadgeModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    MultiSelectModule,
    CommonModule,
    FileUploadModule,
  ],
  templateUrl: './top-header.component.html',
  styleUrl: './top-header.component.css',
})
export class TopHeaderComponent implements OnInit {
  authService = inject(AuthService);
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  router = inject(Router);
  visible: boolean = false;
  sidebarVisible: boolean = false;
  formLists: FormLists | undefined;
  items: MenuItem[] | undefined;
  profileItems: MenuItem[] | undefined;
  missionForm!: FormGroup;
  submitted = false;
  // missionTypes = [
  //   { Value: '1', Type: 'Time Mission' },
  //   { Value: '2', Type: 'Goal Mission' },
  // ];
  missionTypes: { key: string, value: any }[] = [];

  missionAvailibilities = [
    { Value: '1', Type: 'Yes' },
    { Value: '2', Type: 'No' },
  ]
  cities: any[] = [];
  images: File[] = [];
  files: File[] = [];
  minDate: Date | undefined;
  minStartDate: Date | undefined;
  minEndDate: Date | undefined;
  showStartDateError: boolean = false;
  showEndDateError: boolean = false;
  @ViewChild('registrationDeadlineInput') public registrationDeadlineInput!: Calendar;
  @ViewChild('startDateInput') public startDateInput!: Calendar;
  @ViewChild('endDateInput') public endDateInput!: Calendar;
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @ViewChild('imageUpload') imageUpload!: FileUpload;
  ngOnInit() {
    this.missionForm = this.formBuilder.group({
      CountryId: ['', [Validators.required]],
      CityId: ['', [Validators.required]],
      MissionTitle: ['', [Validators.required]],
      MissionShortDescription: ['', [Validators.required]],
      MissionDescription: ['', [Validators.required]],
      MissionOrganisationName: ['', [Validators.required]],
      MissionOrganisationDetail: ['', [Validators.required]],
      TotalSeats: ['', [Validators.required]],
      MissionType: ['', [Validators.required]],
      MissionRegistrationDeadline: [''],
      MissionStartDate: [''],
      MissionEndDate: [''],
      TotalGoal: [''],
      GoalObject: [''],
      ThemeId: ['', [Validators.required]],
      MissionSkill: [[], [Validators.required]],
      MissionAvailability: ['', [Validators.required]],
    });

    this.dialogService.openDialog$.subscribe(() => {
      this.showDialog();
    });

    this.missionTypes = enumToKeyValueArray(MissionTypeEnum);

    this.minDate = new Date();
    this.missionForm.get('MissionRegistrationDeadline')!.valueChanges.subscribe((value) => {
      console.log(value);
      if(value == null){
        this.missionForm.controls['MissionStartDate'].setValue(null);
        this.missionForm.controls['MissionEndDate'].setValue(null);
          
      }else if(value >= this.missionForm.get('MissionStartDate')?.value){
        this.minStartDate = value;
        this.missionForm.controls['MissionStartDate'].setValue(this.minStartDate);
      }else{
        this.minStartDate = value;
      }
    });
    
    this.missionForm.get('MissionStartDate')!.valueChanges.subscribe((value) => {
      console.log(value);
      if(value == null){
        this.missionForm.controls['MissionEndDate'].setValue(null);
      }else if(value >= this.missionForm.get('MissionEndDate')?.value){
        this.minEndDate = value;
        this.missionForm.controls['MissionEndDate'].setValue(this.minEndDate);
      }else{
        this.minEndDate = value;
      }
    });
    this.missionForm.get('MissionType')!.valueChanges.subscribe((value) => {
      this.updateValidators(value);
    });
    
    this.items = [
      {
        label: 'Explore',
        items: [
          {
            label: 'Top Themes',
            items: [
              { label: 'Education' },
              { label: 'Education' },
              { label: 'Education' },
              { label: 'Education' },
              { label: 'Education' },
            ],
          },
          {
            label: 'Top Countries',
            items: [
              { label: 'c1' },
              { label: 'c2' },
              { label: 'c3' },
              { label: 'c5' },
              { label: 'c6' },
            ],
          },
          {
            label: 'Top Organisations',
            items: [
              { label: 'o1' },
              { label: 'o2' },
              { label: 'o3' },
              { label: 'o4' },
              { label: 'o5' },
            ],
          },
          {
            label: 'Most Ranked',
            items: [
              { label: 'Education' },
              { label: 'Education' },
              { label: 'Education' },
              { label: 'Education' },
              { label: 'Education' },
            ],
          },
          {
            label: 'Top Favourite',
            items: [
              { label: 'Education' },
              { label: 'Education' },
              { label: 'Education' },
              { label: 'Education' },
              { label: 'Education' },
            ],
          },
          {
            label: 'Recommended',
            items: [
              { label: 'Education' },
              { label: 'Education' },
              { label: 'Education' },
              { label: 'Education' },
              { label: 'Education' },
            ],
          },
          {
            label: 'Random',
            items: [
              { label: 'Education' },
              { label: 'Education' },
              { label: 'Education' },
              { label: 'Education' },
              { label: 'Education' },
            ],
          },
        ],
      },
      {
        label: 'Stories',
      },
      {
        label: 'News',
      },
      {
        label: 'Policy',
        items: [{ label: 'Volunteering' }, { label: 'Sponsoring' }],
      },
    ];

    this.profileItems = [
      {
        label: 'User Name',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home' },
          { label: 'User Profile', icon: 'pi pi-fw pi-user' },
          { separator: true },
          { label: 'Logout', icon: 'pi pi-fw pi-sign-out' },
        ],
      },
    ];

    this.updateValidators(this.missionForm.get('MissionType')!.value);
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  showDialog() {
    this.visible = true;
    this.userService.getFormLists().subscribe({
      next: (response) => {
        if (response.result) {
          this.formLists = response.data;
          console.log(this.formLists);
          console.log('hello');
        } else {
          console.log('hello return');

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message,
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
    });
  }
  get isTimeMission() {
    return this.missionForm.get('MissionType')!.value == 1;
  }

  get isGoalMission() {
    return this.missionForm.get('MissionType')!.value == 2;
  }

  updateValidators(missionType: number | null) {
    console.log(missionType);
    if (missionType === 1) {
      this.missionForm
        .get('MissionStartDate')!
        .setValidators(Validators.required);
      this.missionForm
        .get('MissionEndDate')!
        .setValidators(Validators.required);
      this.missionForm
        .get('MissionRegistrationDeadline')!
        .setValidators(Validators.required);
      this.missionForm.get('GoalObject')!.clearValidators();
      this.missionForm.get('TotalGoal')!.clearValidators();
    } else if (missionType === 2) {
      this.missionForm.get('MissionStartDate')!.clearValidators();
      this.missionForm.get('MissionEndDate')!.clearValidators();
      this.missionForm.get('MissionRegistrationDeadline')!.clearValidators();
      this.missionForm.get('GoalObject')!.setValidators(Validators.required);
      this.missionForm.get('TotalGoal')!.setValidators(Validators.required);
    } else {
      this.missionForm.get('MissionStartDate')!.clearValidators();
      this.missionForm.get('MissionEndDate')!.clearValidators();
      this.missionForm.get('MissionRegistrationDeadline')!.clearValidators();
      this.missionForm.get('GoalObject')!.clearValidators();
      this.missionForm.get('TotalGoal')!.clearValidators();
    }

    this.missionForm.get('MissionStartDate')!.updateValueAndValidity();
    this.missionForm.get('MissionEndDate')!.updateValueAndValidity();
    this.missionForm
      .get('MissionRegistrationDeadline')!
      .updateValueAndValidity();
    this.missionForm.get('GoalObject')!.updateValueAndValidity();
    this.missionForm.get('TotalGoal')!.updateValueAndValidity();
  }
  onSelectImages(event: any) {
    this.images = [];
    
    for (let file of event.files) {
      if(file.size < 1048576 && file.type.includes('image')){
      this.images.push(file);}
      console.log(this.images);
    }
  }
  onSelectFiles(event: any) {
    this.files = [];
    for (let file of event.files) {
      if(file.size < 2097152 && (file.type == 'application/pdf' || file.type == 'application/doc')){
      this.files.push(file);}
      console.log(this.files);
    }
  }
  onRemoveImage(event: any){
      this.images = this.images.filter(function (files) {
        return files != event.file;})
        console.log(this.images);
  }
  onRemoveFile(event: any){
      this.files = this.files.filter(function (files) {
        return files != event.file;})
        console.log(this.files);
  }

  triggerImageUpload() {
    this.imageUpload.choose();
  }
  triggerFileUpload() {
    this.fileUpload.choose();
  }
  onSubmit() {
    this.submitted = true;
    console.log(this.missionForm.valid);
    if (this.missionForm.valid) {
      const formData = new FormData();
      formData.append('CountryId', this.missionForm.get('CountryId')!.value);
      formData.append('CityId', this.missionForm.get('CityId')!.value);
      formData.append('MissionTitle', this.missionForm.get('MissionTitle')!.value);
      formData.append('MissionShortDescription', this.missionForm.get('MissionShortDescription')!.value);
      formData.append('MissionDescription', this.missionForm.get('MissionDescription')!.value);
      formData.append('MissionOrganisationName', this.missionForm.get('MissionOrganisationName')!.value);
      formData.append('MissionOrganisationDetail', this.missionForm.get('MissionOrganisationDetail')!.value);
      formData.append('TotalSeats', this.missionForm.get('TotalSeats')!.value);
      formData.append('MissionType', this.missionForm.get('MissionType')!.value);
      formData.append('ThemeId', this.missionForm.get('ThemeId')!.value);
      formData.append('MissionAvailability', this.missionForm.get('MissionAvailability')!.value);
      const missionSkills: number[] = this.missionForm.get('MissionSkill')!.value;
      console.log(missionSkills);
      
    missionSkills.forEach(skill => {
      console.log(skill);
      formData.append('MissionSkill', skill.toString()); // Convert to string to append
    });
      
      if (this.isTimeMission) {
        formData.append('MissionStartDate',this.formatDate(this.missionForm.get('MissionStartDate')!.value));
        formData.append('MissionEndDate', this.formatDate(this.missionForm.get('MissionEndDate')!.value));
        formData.append('MissionRegistrationDeadline', this.formatDate(this.missionForm.get('MissionRegistrationDeadline')!.value));
      }

      if (this.isGoalMission) {
        formData.append('GoalObject', this.missionForm.get('GoalObject')!.value);
        formData.append('TotalGoal', this.missionForm.get('TotalGoal')!.value);
      }

      this.images.forEach((file, index) => {
        formData.append('images', file, file.name);
      });
      this.files.forEach((file, index) => {
        formData.append('document', file, file.name);
      });
      this.userService.createMission(formData).subscribe({
        next:(response) => {
          if(response.result){
          this.messageService.add({severity:'success', summary:'Success', detail: response.message});}
          else{
          this.messageService.add({severity:'error', summary:'Error', detail: response.message});}
        },
        error:(error) => {
          this.messageService.add({severity:'error', summary:'Error', detail: error.message});
        }
      })
    } else {
      this.missionForm.markAllAsTouched();
      return;
    }
  }

  onCountryChange(event: any): void {
    const countryId = event.value;
    console.log(countryId);
    if (countryId) {
      this.userService.getCities(Number(countryId)).subscribe((response) => {
        this.cities = response.data;
        console.log(this.cities);
      });
    } else {
      this.cities = [];
    }
  }
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(date.getDate())}`;
  }
  
  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  onMissionDateFocus(event: any) {
    const registrationDeadlineControl = this.missionForm.get('MissionRegistrationDeadline');
    if (!registrationDeadlineControl!.value) {
      this.showStartDateError = true;
      window.setTimeout(() => {
        this.registrationDeadlineInput.inputfieldViewChild?.nativeElement.focus();
          this.startDateInput.inputfieldViewChild?.nativeElement.blur();
          this.startDateInput.overlayVisible = false; 
    }, 0);
    } else {
      this.showStartDateError = false;
    }
  }
  onMissionEndDateFocus(event: Event) {
    const stratDateControl = this.missionForm.get('MissionStartDate');
    if (!stratDateControl!.value) {
      this.showEndDateError = true;
      window.setTimeout(() => {
        this.startDateInput.inputfieldViewChild?.nativeElement.focus();
        this.endDateInput.inputfieldViewChild?.nativeElement.blur();
        this.endDateInput.overlayVisible = false;
    }, 0);
    } else {
      this.showEndDateError = false;
    }
  }
}
