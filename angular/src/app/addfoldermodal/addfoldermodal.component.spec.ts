import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfoldermodalComponent } from './addfoldermodal.component';

describe('AddfoldermodalComponent', () => {
  let component: AddfoldermodalComponent;
  let fixture: ComponentFixture<AddfoldermodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddfoldermodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddfoldermodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
