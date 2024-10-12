import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfolderformComponent } from './addfolderform.component';

describe('AddfolderformComponent', () => {
  let component: AddfolderformComponent;
  let fixture: ComponentFixture<AddfolderformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddfolderformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddfolderformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
