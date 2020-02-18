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
    timestamp: {
      name: 'timestamp',
      type: 'integer',
    },
    note: {
      name: 'note',
      type: 'varchar',
    },
    isIgnored: {
      name: 'is_ignored',
      type: 'boolean',
      default: 0,
    },
    isMonthly: {
      name: 'is_monthly',
      type: 'boolean',
      default: 0,
    },
  };
}
