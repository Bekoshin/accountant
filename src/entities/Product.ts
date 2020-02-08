import {ProductMeta} from './meta/ProductMeta';
import {
  Column,
  ColumnOptions,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm/browser';
import Operation from './Operation';

@Entity(ProductMeta.table.name)
export default class Product {
  @PrimaryGeneratedColumn({
    name: ProductMeta.columns.id.name,
    type: ProductMeta.columns.id.type,
  })
  private _id: number | undefined;

  @Column(ProductMeta.columns.name as ColumnOptions)
  private _name: string;

  @Column(ProductMeta.columns.value as ColumnOptions)
  private _value: number | undefined;

  @ManyToOne(type => Operation, operation => operation.products)
  @JoinColumn({name: ProductMeta.columns.operationId.name})
  private _operation: Operation | null;

  constructor(
    name: string,
    operation?: Operation,
    value?: number,
    id?: number,
  ) {
    this._id = id;
    this._name = name;
    this._value = value;
    if (operation) {
      this._operation = operation;
    } else {
      this._operation = null;
    }
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
