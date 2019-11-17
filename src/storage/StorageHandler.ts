import {
  Connection,
  createConnection,
  getRepository,
  Repository,
} from 'typeorm/browser';
import Category from '../entities/Category';

const DATABASE_NAME = 'main.db';

export default class StorageHandler {
  private _connection: Connection | undefined;

  private _categoryRepo: Repository<Category> | undefined;

  constructor() {
    this._connection = undefined;
    this._categoryRepo = undefined;
  }

  public connect = async () => {
    this._connection = await createConnection({
      type: 'react-native',
      database: DATABASE_NAME,
      location: 'default',
      logging: ['error', 'query', 'schema'],
      synchronize: true,
      entities: [Category],
    });
  };

  public initCategoryRep = () => {
    this._categoryRepo = getRepository(Category);
  };
}
