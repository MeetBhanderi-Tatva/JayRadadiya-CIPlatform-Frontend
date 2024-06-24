import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionCardListComponent } from './mission-card-list.component';

describe('MissionCardListComponent', () => {
  let component: MissionCardListComponent;
  let fixture: ComponentFixture<MissionCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionCardListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MissionCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
