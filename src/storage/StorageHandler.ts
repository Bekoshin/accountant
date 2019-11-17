import {
  Connection,
  createConnection,
  getRepository,
  Repository,
} from 'typeorm/browser';
import Category from '../entities/Category';
import Operation from '../entities/Operation';

const DATABASE_NAME = 'main.db';

export default class StorageHandler {
  private _connection: Connection | undefined;

  private _categoryRepo: Repository<Category> | undefined;
  private _expenseRepo: Repository<Operation> | undefined;

  constructor() {
    this._connection = undefined;
    this._categoryRepo = undefined;
  }

  public init = async () => {
    await this.connect();
    await this.initCategoryRepo();
    await this.initExpenseRepo();
  };

  private connect = async () => {
    this._connection = await createConnection({
      type: 'react-native',
      database: DATABASE_NAME,
      location: 'default',
      logging: ['error', 'query', 'schema'],
      synchronize: true,
      entities: [Category, Operation],
    });
  };

  private initCategoryRepo = () => {
    this._categoryRepo = getRepository(Category);
  };

  private initExpenseRepo = () => {
    this._expenseRepo = getRepository(Operation);
  };

  public getAllExpensesFromRepo = async (): Promise<Operation[]> => {
    let expenses: Operation[] = [];
    if (this._expenseRepo) {
      expenses = await this._expenseRepo.find();
    }
    return expenses;
  };
}
