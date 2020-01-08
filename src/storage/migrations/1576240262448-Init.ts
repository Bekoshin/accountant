import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm/browser';
import {CategoryMeta} from '../../entities/meta/CategoryMeta';
import {OperationMeta} from '../../entities/meta/OperationMeta';

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
            name: OperationMeta.columns.date.name,
            type: OperationMeta.columns.date.type,
          },
          {
            name: OperationMeta.columns.note.name,
            type: OperationMeta.columns.note.type,
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
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
