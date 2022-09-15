import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBillTransactionsComponent } from './view-bill-transactions.component';

describe('ViewBillTransactionsComponent', () => {
  let component: ViewBillTransactionsComponent;
  let fixture: ComponentFixture<ViewBillTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBillTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBillTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
