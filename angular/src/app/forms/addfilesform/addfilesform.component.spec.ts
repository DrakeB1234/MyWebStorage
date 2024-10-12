import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddfilesformComponent } from './addfilesform.component';


describe('addfilesform', () => {
  let component: AddfilesformComponent;
  let fixture: ComponentFixture<AddfilesformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddfilesformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddfilesformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
