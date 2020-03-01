export class SubscriptionMeta {
  static table = {
    name: 'subscription',
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
    categoryId: {
      name: 'category_id',
      type: 'integer',
      isNullable: true,
    },
    day: {
      name: 'number',
      type: 'integer',
    },
    value: {
      name: 'value',
      type: 'double precision',
      isNullable: true,
    },
  };
}
