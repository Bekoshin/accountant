import {ProductMeta} from './meta/ProductMeta';
import {
  Column,
  ColumnOptions,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm/browser';
import Operation from './Operation';
import {BaseEntity} from './BaseEntity';

@Entity(ProductMeta.table.name)
export default class Product extends BaseEntity {
  @Column(ProductMeta.columns.name as ColumnOptions)
  private _name: string;

  @Column(ProductMeta.columns.value as ColumnOptions)
  private _value: number | undefined;

  // @ts-ignore
  @ManyToOne(type => Operation, operation => operation._products)
  @JoinColumn({name: ProductMeta.columns.operationId.name})
  private _operation: Operation | null;

  constructor(
    name: string,
    operation?: Operation,
    value?: number,
    id?: number,
  ) {
    super(id);
    this._name = name;
    this._value = value;
    if (operation) {
      this._operation = operation;
    } else {
      this._operation = null;
    }
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get value(): number | undefined {
    return this._value;
  }

  set value(value: number | undefined) {
    this._value = value;
  }

  get operation(): Operation | null {
    return this._operation;
  }

  set operation(value: Operation | null) {
    this._operation = value;
  }
}
