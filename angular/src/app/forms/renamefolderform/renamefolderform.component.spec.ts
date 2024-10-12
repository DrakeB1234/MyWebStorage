import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenamefolderformComponent } from './renamefolderform.component';

describe('RenamefolderformComponent', () => {
  let component: RenamefolderformComponent;
  let fixture: ComponentFixture<RenamefolderformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenamefolderformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenamefolderformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
