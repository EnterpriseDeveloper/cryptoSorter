import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcoLikeComponent } from './ico-like.component';

describe('IcoLikeComponent', () => {
  let component: IcoLikeComponent;
  let fixture: ComponentFixture<IcoLikeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcoLikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcoLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
