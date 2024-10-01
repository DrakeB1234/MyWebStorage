import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcurrentdirectoryComponent } from './showcurrentdirectory.component';

describe('ShowcurrentdirectoryComponent', () => {
  let component: ShowcurrentdirectoryComponent;
  let fixture: ComponentFixture<ShowcurrentdirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcurrentdirectoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowcurrentdirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
