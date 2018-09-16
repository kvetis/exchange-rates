import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const ERATES_API = 'https://api.exchangeratesapi.io/';

@Injectable()
export class ExchangeRateService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  public getExchangeRates(date: Date, base: string): Observable<ExchangeRates> {
    return this.fetchExchangeRates(date, base).pipe(
      map(result => {
        return {
          date: result.date,
          rates: this.ratesToArray(result.rates)
        };
      }),
    );
  }

  private fetchExchangeRates(date: Date, base: string) {
    const dateString = this.toISODate(date);
    return this.httpClient.get<RatesResult>(
      ERATES_API + `${dateString}?base=${base}`
    );
  }

  private ratesToArray(rates: { [key: string]: number }): CurrencyRate[] {
    return Object.entries(rates).map((pair: [string, number]) => {
      let currency: string, rate: number;
      [currency, rate] = pair;
      return { currency, rate, ...this.createBuySell(rate) };
    });
  }

  public toISODate(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  private createBuySell(rate) {
    return {
      buy: rate * 0.95,
      sell: rate * 1.05,
    };
  }
}

interface RatesResult {
  base: string;
  date: string;
  rates: {
    [key: string]: number,
  };
}

export interface CurrencyRate {
  currency: string;
  rate: number;
  buy: number;
  sell: number;
}

export interface ExchangeRates {
  date: string;
  rates: CurrencyRate[];
}
