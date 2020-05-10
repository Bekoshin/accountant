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
    iconName: {
      name: 'icon_name',
      type: 'varchar',
      isNullable: true,
    },
    isDefault: {
      name: 'is_default',
      type: 'boolean',
      default: 0,
    },
    isValid: {
      name: 'is_valid',
      type: 'boolean',
      default: 1,
    },
  };
}
