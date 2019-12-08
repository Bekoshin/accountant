import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm/browser';

@Entity('categories')
export default class Category {
  @PrimaryGeneratedColumn()
  private readonly _id: number | undefined;

  @Column('varchar')
  private _name: string;

  @ManyToOne(type => Category, category => category._childCategories)
  @JoinColumn({name: 'parent_category_id'})
  private _parentCategory: Category | undefined;

  @OneToMany(type => Category, category => category._parentCategory)
  private _childCategories: Category[] | undefined;

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
      this._childCategories = undefined;
    }
    if (parentCategory) {
      this._parentCategory = parentCategory;
    } else {
      this._parentCategory = undefined;
    }
  }

  get parentCategory(): Category | undefined {
    return this._parentCategory;
  }

  set parentCategory(value: Category | undefined) {
    this._parentCategory = value;
  }

  get childCategories(): Category[] | undefined {
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
