export class SubscriptionMeta {
  static table = {
    name: 'subscriptions',
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
    amount: {
      name: 'amount',
      type: 'double precision',
    },
    note: {
      name: 'note',
      type: 'varchar',
    },
  };
}
