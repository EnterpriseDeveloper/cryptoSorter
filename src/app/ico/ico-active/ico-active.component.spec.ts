import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcoActiveComponent } from './ico-active.component';

describe('IcoActiveComponent', () => {
  let component: IcoActiveComponent;
  let fixture: ComponentFixture<IcoActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcoActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcoActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
