import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowfoldersComponent } from './showfolders.component';

describe('ShowfoldersComponent', () => {
  let component: ShowfoldersComponent;
  let fixture: ComponentFixture<ShowfoldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowfoldersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowfoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
