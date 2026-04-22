import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioProdotto } from './dettaglio-prodotto';

describe('DettaglioProdotto', () => {
  let component: DettaglioProdotto;
  let fixture: ComponentFixture<DettaglioProdotto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DettaglioProdotto],
    }).compileComponents();

    fixture = TestBed.createComponent(DettaglioProdotto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
