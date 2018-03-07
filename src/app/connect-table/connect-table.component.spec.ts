import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectTableComponent } from './connect-table.component';

describe('ConnectTableComponent', () => {
  let component: ConnectTableComponent;
  let fixture: ComponentFixture<ConnectTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
