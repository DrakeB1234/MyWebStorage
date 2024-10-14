import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerinfoComponent } from './serverinfo.component';

describe('ServerinfoComponent', () => {
  let component: ServerinfoComponent;
  let fixture: ComponentFixture<ServerinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerinfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
