import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovefileformComponent } from './movefileform.component';

describe('MovefileformComponent', () => {
  let component: MovefileformComponent;
  let fixture: ComponentFixture<MovefileformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovefileformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovefileformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
