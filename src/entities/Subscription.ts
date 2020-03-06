import {
  Column,
  ColumnOptions,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm/browser';
import Category from './Category';
import {SubscriptionMeta} from './meta/SubscriptionMeta';
import {PrimaryGeneratedColumnType} from 'typeorm/browser/driver/types/ColumnTypes';

@Entity(SubscriptionMeta.table.name)
export default class Subscription {
  @PrimaryGeneratedColumn({
    name: SubscriptionMeta.columns.id.name,
    type: SubscriptionMeta.columns.id.type as PrimaryGeneratedColumnType,
  })
  private _id: number | undefined;

  @Column(SubscriptionMeta.columns.name as ColumnOptions)
  private _name: string;

  @ManyToOne(() => Category)
  @JoinColumn({name: SubscriptionMeta.columns.categoryId.name})
  private _category: Category;

  @Column(SubscriptionMeta.columns.value as ColumnOptions)
  private _value: number;

  @Column(SubscriptionMeta.columns.day as ColumnOptions)
  private _day: number;

  @Column(SubscriptionMeta.columns.note as ColumnOptions)
  private _note: string;

  constructor(
    id: number | undefined,
    name: string,
    category: Category,
    value: number,
    day: number,
    note: string,
  ) {
    this._id = id;
    this._name = name;
    this._category = category;
    this._value = value;
    this._day = day;
    this._note = note;
  }

  get id(): number | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get category(): Category {
    return this._category;
  }

  set category(value: Category) {
    this._category = value;
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
  }

  get day(): number {
    return this._day;
  }

  set day(value: number) {
    this._day = value;
  }

  get note(): string {
    return this._note;
  }

  set note(value: string) {
    this._note = value;
  }
}
