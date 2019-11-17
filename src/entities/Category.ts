import {Entity, PrimaryColumn, Column} from 'typeorm/browser';

@Entity('categories')
export default class Category {
  @PrimaryColumn('bigint')
  id: number;

  @Column('varchar')
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
