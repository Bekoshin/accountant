import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm/browser';

@Entity('categories')
export default class Category {
  @PrimaryColumn('bigint')
  private _id: number;

  @Column('varchar')
  private _name: string;

  @ManyToOne(type => Category, category => category.childCategories)
  private _parentCategory: Category | null;

  @OneToMany(type => Category, category => category.parentCategory)
  private _childCategories: Category[] | null;

  constructor(
    id: number,
    name: string,
    subcategories?: Category[],
    parentCategory?: Category,
  ) {
    this._id = id;
    this._name = name;
    if (subcategories) {
      this._childCategories = subcategories;
    } else {
      this._childCategories = null;
    }
    if (parentCategory) {
      this._parentCategory = parentCategory;
    } else {
      this._parentCategory = null;
    }
  }

  get parentCategory(): Category | null {
    return this._parentCategory;
  }

  set parentCategory(value: Category | null) {
    this._parentCategory = value;
  }

  get childCategories(): Category[] | null {
    return this._childCategories;
  }

  set childCategories(value: Category[] | null) {
    this._childCategories = value;
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
}
