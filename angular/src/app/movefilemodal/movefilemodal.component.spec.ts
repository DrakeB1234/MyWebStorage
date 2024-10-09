import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovefilemodalComponent } from './movefilemodal.component';

describe('MovefilemodalComponent', () => {
  let component: MovefilemodalComponent;
  let fixture: ComponentFixture<MovefilemodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovefilemodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovefilemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
