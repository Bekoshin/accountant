import {
  Column,
  ColumnOptions,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm/browser';
import Category from './Category';
import {OperationMeta} from './meta/OperationMeta';

@Entity(OperationMeta.table.name)
export default class Operation {
  @PrimaryGeneratedColumn({
    name: OperationMeta.columns.id.name,
    type: OperationMeta.columns.id.type,
  })
  private _id: number;

  @Column(OperationMeta.columns.name as ColumnOptions)
  private _name: string;

  @Column(OperationMeta.columns.amount as ColumnOptions)
  private _amount: number;

  @ManyToOne(() => Category)
  @JoinColumn({name: OperationMeta.columns.categoryId.name})
  private _category: Category;

  @Column(OperationMeta.columns.date as ColumnOptions)
  private _date: Date;

  @Column(OperationMeta.columns.note as ColumnOptions)
  private _note: string;

  constructor(
    id: number,
    name: string,
    amount: number,
    category: Category,
    date: Date,
    note: string,
  ) {
    this._id = id;
    this._name = name;
    this._amount = amount;
    this._category = category;
    this._date = date;
    this._note = note;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
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
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
  }

  get note(): string {
    return this._note;
  }

  set note(value: string) {
    this._note = value;
  }
}
