import {Column, ColumnOptions, Entity, OneToMany} from 'typeorm/browser';
import Category from './Category';
import {OperationMeta} from './meta/OperationMeta';
import Product from './Product';
import {OperationEntity} from './OperationEntity';

@Entity(OperationMeta.table.name)
export default class Operation extends OperationEntity {
  @Column(OperationMeta.columns.timestamp as ColumnOptions)
  private _timestamp: number;

  @Column(OperationMeta.columns.isIgnored as ColumnOptions)
  private _isIgnored: boolean;

  @Column(OperationMeta.columns.subscriptionId as ColumnOptions)
  private _subscriptionId: number | null;

  // @ts-ignore
  @OneToMany(type => Product, product => product._operation)
  private _products: Product[] | null;

  constructor(
    amount: number,
    category: Category,
    timestamp: number,
    note: string,
    isIgnored: boolean = false,
    subscriptionId: number | null = null,
    products?: Product[],
    id?: number,
  ) {
    super(amount, category, note, id);
    this._timestamp = timestamp;
    this._isIgnored = isIgnored;
    this._subscriptionId = subscriptionId;
    if (products) {
      this._products = products;
    } else {
      this._products = null;
    }
  }

  get date(): Date {
    return new Date(this._timestamp);
  }

  get timestamp(): number {
    return this._timestamp;
  }

  set timestamp(value: number) {
    this._timestamp = value;
  }

  get products(): Product[] | null {
    return this._products;
  }

  set products(value: Product[] | null) {
    this._products = value;
  }

  get isIgnored(): boolean {
    return this._isIgnored;
  }

  set isIgnored(value: boolean) {
    this._isIgnored = value;
  }

  get subscriptionId(): number | null {
    return this._subscriptionId;
  }

  set subscriptionId(value: number | null) {
    this._subscriptionId = value;
  }
}
