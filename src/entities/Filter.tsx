import Category from './Category';

class Filter {
  private _amountFrom: number | undefined;
  private _amountTo: number | undefined;
  private _categories: Category[];
  private _dateFrom: Date | undefined;
  private _dateTo: Date | undefined;
  private _note: string;
  private _subscriptionId: number | undefined;

  constructor(
    amountFrom: number | undefined,
    amountTo: number | undefined,
    categories: Category[],
    dateFrom: Date | undefined,
    dateTo: Date | undefined,
    note: string,
    subscriptionId: number | undefined,
  ) {
    this._amountFrom = amountFrom;
    this._amountTo = amountTo;
    this._categories = categories;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;
    this._note = note;
    this._subscriptionId = subscriptionId;
  }

  get amountFrom(): number | undefined {
    return this._amountFrom;
  }

  set amountFrom(value: number | undefined) {
    this._amountFrom = value;
  }

  get amountTo(): number | undefined {
    return this._amountTo;
  }

  set amountTo(value: number | undefined) {
    this._amountTo = value;
  }

  get categories(): Category[] {
    return this._categories;
  }

  set categories(value: Category[]) {
    this._categories = value;
  }

  get dateFrom(): Date | undefined {
    return this._dateFrom;
  }

  set dateFrom(value: Date | undefined) {
    this._dateFrom = value;
  }

  get dateTo(): Date | undefined {
    return this._dateTo;
  }

  set dateTo(value: Date | undefined) {
    this._dateTo = value;
  }

  get note(): string {
    return this._note;
  }

  set note(value: string) {
    this._note = value;
  }

  get subscriptionId(): number | undefined {
    return this._subscriptionId;
  }

  set subscriptionId(value: number | undefined) {
    this._subscriptionId = value;
  }
}

export {Filter};
