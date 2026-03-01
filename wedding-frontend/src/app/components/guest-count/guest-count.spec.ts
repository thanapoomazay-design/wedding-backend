import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestCount } from './guest-count';

describe('GuestCount', () => {
  let component: GuestCount;
  let fixture: ComponentFixture<GuestCount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestCount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestCount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
