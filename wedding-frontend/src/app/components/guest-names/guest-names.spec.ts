import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestNames } from './guest-names';

describe('GuestNames', () => {
  let component: GuestNames;
  let fixture: ComponentFixture<GuestNames>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestNames]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestNames);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
