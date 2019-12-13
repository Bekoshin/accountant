export class CategoryMeta {
  static table = {
    name: 'categories',
  };
  static columns = {
    id: {
      name: 'id',
      type: 'bigint',
      isPrimary: true,
      isGenerated: true,
    },
    name: {
      name: 'name',
      type: 'varchar',
    },
    parentCategoryId: {
      name: 'parent_category_id',
      type: 'bigint',
      isNullable: true,
    },
  };
}
