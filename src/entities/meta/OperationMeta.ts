export class OperationMeta {
  static table = {
    name: 'operations',
  };
  static columns = {
    id: {
      name: 'id',
      type: 'integer',
      isPrimary: true,
      isGenerated: true,
    },
    amount: {
      name: 'amount',
      type: 'double precision',
    },
    categoryId: {
      name: 'category_id',
      type: 'integer',
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
    isIgnored: {
      name: 'is_ignored',
      type: 'boolean',
      default: false,
    },
  };
}
