import {BaseEntity} from './BaseEntity';
import {Column, ColumnOptions, JoinColumn, ManyToOne} from 'typeorm/browser';
import {OperationMeta} from './meta/OperationMeta';
import Category from './Category';
import {SubscriptionMeta} from './meta/SubscriptionMeta';

export abstract class OperationEntity extends BaseEntity {
  @Column(OperationMeta.columns.amount as ColumnOptions)
  private _amount: number;

  @ManyToOne(() => Category)
  @JoinColumn({name: OperationMeta.columns.categoryId.name})
  private _category: Category;

  @Column(SubscriptionMeta.columns.note as ColumnOptions)
  private _note: string;

  protected constructor(
    amount: number,
    category: Category,
    note: string,
    id?: number,
  ) {
    super(id);
    this._amount = amount;
    this._category = category;
    this._note = note;
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

  get note(): string {
    return this._note;
  }

  set note(value: string) {
    this._note = value;
  }
}
