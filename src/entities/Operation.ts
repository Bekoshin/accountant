import {
  Column,
  ColumnOptions,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm/browser';
import Category from './Category';
import {OperationMeta} from './meta/OperationMeta';
import Product from './Product';
import {PrimaryGeneratedColumnType} from 'typeorm/browser/driver/types/ColumnTypes';

@Entity(OperationMeta.table.name)
export default class Operation {
  @PrimaryGeneratedColumn({
    name: OperationMeta.columns.id.name,
    type: OperationMeta.columns.id.type as PrimaryGeneratedColumnType,
  })
  private _id: number | undefined;

  @Column(OperationMeta.columns.amount as ColumnOptions)
  private _amount: number;

  @ManyToOne(() => Category)
  @JoinColumn({name: OperationMeta.columns.categoryId.name})
  private _category: Category;

  @Column(OperationMeta.columns.timestamp as ColumnOptions)
  private _timestamp: number;

  @Column(OperationMeta.columns.note as ColumnOptions)
  private _note: string;

  @Column(OperationMeta.columns.isIgnored as ColumnOptions)
  private _isIgnored: boolean;

  @Column(OperationMeta.columns.subscriptionId as ColumnOptions)
  private _subscriptionId: number | null;

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
    this._id = id;
    this._amount = amount;
    this._category = category;
    this._timestamp = timestamp;
    this._note = note;
    this._isIgnored = isIgnored;
    this._subscriptionId = subscriptionId;
    if (products) {
      this._products = products;
    } else {
      this._products = null;
    }
  }

  get id(): number | undefined {
    return this._id;
  }

  get amount(): number {
    return this._amount;
  }

  set amount(value: number) {
    this._amount = value;
  }

  get category(): Category {
    return this._category;
  }

  set category(value: Category) {
    this._category = value;
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

  get note(): string {
    return this._note;
  }

  set note(value: string) {
    this._note = value;
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
