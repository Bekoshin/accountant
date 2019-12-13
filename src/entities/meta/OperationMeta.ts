export class OperationMeta {
  static table = {
    name: 'operations',
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
    categoryId: {
      name: 'category_id',
      type: 'bigint',
      isNullable: true,
    },
    date: {
      name: 'date',
      type: 'datetime',
    },
    note: {
      name: 'note',
      type: 'varchar',
    },
  };
}
