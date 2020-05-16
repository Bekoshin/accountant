import {Column, ColumnOptions, Entity} from 'typeorm/browser';
import Category from './Category';
import {SubscriptionMeta} from './meta/SubscriptionMeta';
import {OperationEntity} from './OperationEntity';

@Entity(SubscriptionMeta.table.name)
export default class Subscription extends OperationEntity {
  @Column(SubscriptionMeta.columns.name as ColumnOptions)
  private _name: string;

  @Column(SubscriptionMeta.columns.day as ColumnOptions)
  private _day: number;

  constructor(
    name: string,
    category: Category,
    amount: number,
    day: number,
    note: string,
    id?: number,
  ) {
    super(amount, category, note, id);
    this._name = name;
    this._day = day;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get day(): number {
    return this._day;
  }

  set day(value: number) {
    this._day = value;
  }
}
