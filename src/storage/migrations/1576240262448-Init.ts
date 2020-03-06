import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm/browser';
import {CategoryMeta} from '../../entities/meta/CategoryMeta';
import {OperationMeta} from '../../entities/meta/OperationMeta';
import {ProductMeta} from '../../entities/meta/ProductMeta';
import {SubscriptionMeta} from '../../entities/meta/SubscriptionMeta';

export class Init1576240262448 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: CategoryMeta.table.name,
        columns: [
          {
            name: CategoryMeta.columns.id.name,
            type: CategoryMeta.columns.id.type,
            isPrimary: CategoryMeta.columns.id.isPrimary,
            isGenerated: CategoryMeta.columns.id.isGenerated,
            generationStrategy: 'increment',
          },
          {
            name: CategoryMeta.columns.name.name,
            type: CategoryMeta.columns.name.type,
          },
          {
            name: CategoryMeta.columns.parentCategoryId.name,
            type: CategoryMeta.columns.parentCategoryId.type,
            isNullable: CategoryMeta.columns.parentCategoryId.isNullable,
          },
          {
            name: CategoryMeta.columns.image.name,
            type: CategoryMeta.columns.image.type,
            isNullable: CategoryMeta.columns.image.isNullable,
          },
          {
            name: CategoryMeta.columns.isDefault.name,
            type: CategoryMeta.columns.isDefault.type,
            default: CategoryMeta.columns.isDefault.default,
          },
          {
            name: CategoryMeta.columns.isValid.name,
            type: CategoryMeta.columns.isValid.type,
            default: CategoryMeta.columns.isValid.default,
          },
        ],
      }),
      true,
      true,
      true,
    );

    await queryRunner.createForeignKey(
      CategoryMeta.table.name,
      new TableForeignKey({
        columnNames: [CategoryMeta.columns.parentCategoryId.name],
        referencedColumnNames: [CategoryMeta.columns.id.name],
        referencedTableName: CategoryMeta.table.name,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: OperationMeta.table.name,
        columns: [
          {
            name: OperationMeta.columns.id.name,
            type: OperationMeta.columns.id.type,
            isPrimary: OperationMeta.columns.id.isPrimary,
            isGenerated: OperationMeta.columns.id.isGenerated,
            generationStrategy: 'increment',
          },
          {
            name: OperationMeta.columns.amount.name,
            type: OperationMeta.columns.amount.type,
          },
          {
            name: OperationMeta.columns.categoryId.name,
            type: OperationMeta.columns.categoryId.type,
            isNullable: OperationMeta.columns.categoryId.isNullable,
          },
          {
            name: OperationMeta.columns.timestamp.name,
            type: OperationMeta.columns.timestamp.type,
          },
          {
            name: OperationMeta.columns.note.name,
            type: OperationMeta.columns.note.type,
          },
          {
            name: OperationMeta.columns.isIgnored.name,
            type: OperationMeta.columns.isIgnored.type,
            default: OperationMeta.columns.isIgnored.default,
          },
          {
            name: OperationMeta.columns.isMonthly.name,
            type: OperationMeta.columns.isMonthly.type,
            default: OperationMeta.columns.isMonthly.default,
          },
        ],
      }),
      true,
      true,
      true,
    );

    await queryRunner.createForeignKey(
      OperationMeta.table.name,
      new TableForeignKey({
        columnNames: [OperationMeta.columns.categoryId.name],
        referencedColumnNames: [CategoryMeta.columns.id.name],
        referencedTableName: CategoryMeta.table.name,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: ProductMeta.table.name,
        columns: [
          {
            name: ProductMeta.columns.id.name,
            type: ProductMeta.columns.id.type,
            isPrimary: ProductMeta.columns.id.isPrimary,
            isGenerated: ProductMeta.columns.id.isGenerated,
            generationStrategy: 'increment',
          },
          {
            name: ProductMeta.columns.name.name,
            type: ProductMeta.columns.name.type,
          },
          {
            name: ProductMeta.columns.value.name,
            type: ProductMeta.columns.value.type,
            isNullable: ProductMeta.columns.value.isNullable,
          },
          {
            name: ProductMeta.columns.operationId.name,
            type: ProductMeta.columns.operationId.type,
            isNullable: ProductMeta.columns.operationId.isNullable,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      ProductMeta.table.name,
      new TableForeignKey({
        columnNames: [ProductMeta.columns.operationId.name],
        referencedColumnNames: [OperationMeta.columns.id.name],
        referencedTableName: OperationMeta.table.name,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: SubscriptionMeta.table.name,
        columns: [
          {
            name: SubscriptionMeta.columns.id.name,
            type: SubscriptionMeta.columns.id.type,
            isPrimary: SubscriptionMeta.columns.id.isPrimary,
            isGenerated: SubscriptionMeta.columns.id.isGenerated,
            generationStrategy: 'increment',
          },
          {
            name: SubscriptionMeta.columns.name.name,
            type: SubscriptionMeta.columns.name.type,
          },
          {
            name: SubscriptionMeta.columns.categoryId.name,
            type: SubscriptionMeta.columns.categoryId.type,
            isNullable: SubscriptionMeta.columns.categoryId.isNullable,
          },
          {
            name: SubscriptionMeta.columns.value.name,
            type: SubscriptionMeta.columns.value.type,
          },
          {
            name: SubscriptionMeta.columns.day.name,
            type: SubscriptionMeta.columns.day.type,
          },
          {
            name: SubscriptionMeta.columns.note.name,
            type: SubscriptionMeta.columns.note.type,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      SubscriptionMeta.table.name,
      new TableForeignKey({
        columnNames: [SubscriptionMeta.columns.categoryId.name],
        referencedColumnNames: [CategoryMeta.columns.id.name],
        referencedTableName: CategoryMeta.table.name,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
