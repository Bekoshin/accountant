import {MigrationInterface, QueryRunner} from 'typeorm/browser';
import Category from '../../entities/Category';
import StorageHandler from '../StorageHandler';

export class InsertDefaultValues1576410388275 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let categories: Category[] = StorageHandler.createDefaultCategories();
    await queryRunner.manager.save(categories);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
