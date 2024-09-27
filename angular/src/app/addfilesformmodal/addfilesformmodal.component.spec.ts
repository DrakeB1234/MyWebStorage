import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfilesformmodalComponent } from './addfilesformmodal.component';

describe('AddfilesformmodalComponent', () => {
  let component: AddfilesformmodalComponent;
  let fixture: ComponentFixture<AddfilesformmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddfilesformmodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddfilesformmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
