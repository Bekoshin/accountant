export class ProductMeta {
  static table = {
    name: 'products',
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
    value: {
      name: 'value',
      type: 'double precision',
      isNullable: true,
    },
    operationId: {
      name: 'operation_id',
      type: 'integer',
      isNullable: true,
    },
  };
}
