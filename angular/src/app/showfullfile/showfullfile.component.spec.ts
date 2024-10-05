import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowfullfileComponent } from './showfullfile.component';

describe('ShowfullfileComponent', () => {
  let component: ShowfullfileComponent;
  let fixture: ComponentFixture<ShowfullfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowfullfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowfullfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
