import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm/browser';
import Category from './Category';

@Entity('expenses')
export default class Expense {
  @PrimaryColumn({name: 'id', type: 'bigint'})
  private _id: number;

  @Column({name: 'name', type: 'varchar'})
  private _name: string;

  @ManyToOne(() => Category)
  @JoinColumn({name: 'category_id'})
  private _category: Category;

  @Column({name: 'date', type: 'datetime'})
  private _date: Date;

  constructor(id: number, name: string, category: Category, date: Date) {
    this._id = id;
    this._name = name;
    this._category = category;
    this._date = date;
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
}
