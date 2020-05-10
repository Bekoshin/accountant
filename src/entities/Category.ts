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
import {PrimaryGeneratedColumnType} from 'typeorm/browser/driver/types/ColumnTypes';

@Entity(CategoryMeta.table.name)
export default class Category {
  @PrimaryGeneratedColumn({
    name: CategoryMeta.columns.id.name,
    type: CategoryMeta.columns.id.type as PrimaryGeneratedColumnType,
  })
  private readonly _id: number | undefined;

  @Column(CategoryMeta.columns.name as ColumnOptions)
  private _name: string;

  @ManyToOne(type => Category, category => category._childCategories)
  @JoinColumn({name: CategoryMeta.columns.parentCategoryId.name})
  private _parentCategory: Category | null;

  @OneToMany(type => Category, category => category._parentCategory)
  private _childCategories: Category[] | null;

  @Column(CategoryMeta.columns.iconName as ColumnOptions)
  private _iconName: string | undefined;

  @Column(CategoryMeta.columns.isDefault as ColumnOptions)
  private _isDefault: boolean;

  @Column(CategoryMeta.columns.isValid as ColumnOptions)
  private _isValid: boolean;

  constructor(
    name: string,
    isDefault: boolean = false,
    isValid: boolean = true,
    parentCategory?: Category,
    iconName?: string,
    childCategories?: Category[],
    id?: number,
  ) {
    this._id = id;
    this._name = name;
    this._iconName = iconName;
    if (childCategories) {
      this._childCategories = childCategories;
    } else {
      this._childCategories = null;
    }
    if (parentCategory) {
      this._parentCategory = parentCategory;
    } else {
      this._parentCategory = null;
    }
    this._isDefault = isDefault;
    this._isValid = isValid;
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

  get iconName(): string | undefined {
    return this._iconName;
  }

  set iconName(value: string | undefined) {
    this._iconName = value;
  }

  get isDefault(): boolean {
    return this._isDefault;
  }

  set isDefault(value: boolean) {
    this._isDefault = value;
  }

  get isValid(): boolean {
    return this._isValid;
  }

  set isValid(value: boolean) {
    this._isValid = value;
  }

  isParentCategory(): boolean {
    return !this.parentCategory;
  }
}
