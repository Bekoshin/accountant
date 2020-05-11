import {PrimaryGeneratedColumn} from 'typeorm/browser';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'integer',
  })
  private readonly _id?: number;

  protected constructor(id?: number) {
    this._id = id;
  }

  get id(): number | undefined {
    return this._id;
  }
}
