import { Component, OnInit } from '@angular/core';
import { Subject, Observable, combineLatest } from 'rxjs';
import { switchMap, tap, map, startWith, filter } from 'rxjs/operators';
import { ExchangeRateService, CurrencyRate } from './exchange-rate.service';

@Component({
  selector: 'my-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {
  public bases = [
    'EUR',
    'USD',
    'GBP',
    'AUD',
    'CAD',
    'JPY',
  ];

  public baseSet = new Set(this.bases);

  public maxDate: string;
  public base = 'EUR';
  public date = new Date();

  public rateSource$: Observable<CurrencyRate[]>;
  public sort: SortOrder;
  public sortOrder = SortOrder;

  private submitSubject = new Subject<void>();
  private sortSubject = new Subject<SortOrder>();

  constructor(
    private exchangeRateService: ExchangeRateService,
  ) {
    this.maxDate = this.exchangeRateService.toISODate(new Date());
  }

  public ngOnInit() {

    const $rates = this.submitSubject.pipe(
      startWith(null),
      map(() => {
        return {
          base: this.base,
          date: this.date
        };
      }),
      filter((inputs) => !!inputs.date),
      switchMap((inputs) => {
        return this.exchangeRateService.getExchangeRates(inputs.date, inputs.base);
      }),
      tap(res => this.date = new Date(res.date)),
      map(res => res.rates),
    );

    this.rateSource$ = combineLatest(
        $rates,
        this.sortSubject.pipe(startWith(this.sort)),
      ).pipe(
        map((data) => this.sortData(data[0], data[1])),
    );
  }

  public submitForm() {
    this.submitSubject.next();
  }

  public changeSort() {
    if (this.sort === SortOrder.Desc) {
      this.sort = SortOrder.Asc;
    } else {
      this.sort = SortOrder.Desc;
    }
    this.sortSubject.next(this.sort);
  }

  private sortData(rates: CurrencyRate[], order: SortOrder) {
    if (!order) {
      return rates;
    }
    return rates.slice().sort((a, b) => {
      const modifier = order === SortOrder.Desc ? -1 : 1;

      if (a.currency < b.currency) {
        return modifier * -1;
      } else if (a.currency > b.currency) {
        return modifier;
      }
      return 0;
    });
  }

}

enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}
