import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ColumnOptions,
} from 'typeorm/browser';
import {CategoryMeta} from './meta/CategoryMeta';

@Entity(CategoryMeta.table.name)
export default class Category {
  @PrimaryGeneratedColumn({
    name: CategoryMeta.columns.id.name,
    type: CategoryMeta.columns.id.type,
  })
  private readonly _id: number | undefined;

  @Column(CategoryMeta.columns.name as ColumnOptions)
  private _name: string;

  @ManyToOne(type => Category, category => category._childCategories)
  @JoinColumn({name: CategoryMeta.columns.parentCategoryId.name})
  private _parentCategory: Category | null;

  @OneToMany(type => Category, category => category._parentCategory)
  private _childCategories: Category[] | null;

  constructor(
    name: string,
    parentCategory?: Category,
    subcategories?: Category[],
    id?: number,
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

  public addChildCategory(category: Category) {
    if (this._childCategories) {
      this._childCategories.push(category);
    } else {
      this._childCategories = [category];
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
}
