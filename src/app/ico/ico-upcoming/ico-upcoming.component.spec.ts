import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcoUpcomingComponent } from './ico-upcoming.component';

describe('IcoUpcomingComponent', () => {
  let component: IcoUpcomingComponent;
  let fixture: ComponentFixture<IcoUpcomingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcoUpcomingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcoUpcomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
