import {ColumnOptions} from 'typeorm';

export class CategoryMeta {
  static table = {
    name: 'categories',
  };
  static columns = {
    id: {
      name: 'id',
      type: 'integer',
      isPrimary: true,
      isGenerated: true,
    },
    name: {
      name: 'name',
      type: 'varchar',
    },
    parentCategoryId: {
      name: 'parent_category_id',
      type: 'integer',
      isNullable: true,
    },
    image: {
      name: 'image',
      type: 'varchar',
      isNullable: true,
    },
  };
}
