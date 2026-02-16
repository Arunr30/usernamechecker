import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Usernamecomponent } from './usernamecomponent';

describe('Usernamecomponent', () => {
  let component: Usernamecomponent;
  let fixture: ComponentFixture<Usernamecomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Usernamecomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Usernamecomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
