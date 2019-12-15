import {
  Connection,
  createConnection,
  getRepository,
  Repository,
} from 'typeorm/browser';
import Category from '../entities/Category';
import Operation from '../entities/Operation';
import {Init1576240262448} from './migrations/1576240262448-Init';
import {InsertDefaultValues1576410388275} from './migrations/1576410388275-InsertDefaultValues';

const DATABASE_NAME = 'main.db';

export default class StorageHandler {
  private _connection: Connection | undefined;

  private _categoryRepo: Repository<Category> | undefined;
  private _operationRepo: Repository<Operation> | undefined;

  constructor() {
    this._connection = undefined;
    this._categoryRepo = undefined;
  }

  public init = async () => {
    await this.connect();
    await this.initCategoryRepo();
    await this.initOperationRepo();
    // await this.addDefaultCategoriesToDb();
    if (this._categoryRepo) {
      let categories = await this._categoryRepo
        .createQueryBuilder('category')
        .leftJoinAndSelect('category._parentCategory', 'pc')
        .leftJoinAndSelect('category._childCategories', 'cc')
        .getMany();
      console.log('CATEGORIES: ', categories);
    }
  };

  private connect = async () => {
    this._connection = await createConnection({
      type: 'react-native',
      database: DATABASE_NAME,
      location: 'default',
      logging: ['error', 'query', 'schema'],
      migrations: [Init1576240262448, InsertDefaultValues1576410388275],
      migrationsRun: true,
      entities: [Category, Operation],
    });
  };

  private initCategoryRepo = () => {
    this._categoryRepo = getRepository(Category);
  };

  private initOperationRepo = () => {
    this._operationRepo = getRepository(Operation);
  };

  public getAllOperationsFromRepo = async (): Promise<Operation[]> => {
    let operations: Operation[] = [];
    if (this._operationRepo) {
      operations = await this._operationRepo.find();
    }
    return operations;
  };

  private addDefaultCategoriesToDb = async () => {
    let categories = StorageHandler.createDefaultCategories();
    if (this._categoryRepo) {
      // await this._categoryRepo.clear();
      console.log('CATEGORIES BEFORE SAVE: ', categories);
      await this._categoryRepo.save(categories);
    }
  };

  static createDefaultCategories = () => {
    let categories: Category[] = [];

    let transport = new Category('transport');
    categories.push(transport);
    categories.push(new Category('taxi', transport));
    categories.push(new Category('subway', transport));
    categories.push(new Category('transportCard', transport));
    categories.push(new Category('petrol', transport));

    let products = new Category('products');
    categories.push(products);

    let entertainment = new Category('entertainment');
    categories.push(entertainment);
    categories.push(new Category('games', entertainment));
    categories.push(new Category('movies', entertainment));

    let health = new Category('health');
    categories.push(health);
    categories.push(new Category('fitness', health));
    categories.push(new Category('pharmacy', health));
    categories.push(new Category('doctor', health));

    let cafesAndRestaurants = new Category('cafes_and_restaurants');
    categories.push(cafesAndRestaurants);
    categories.push(new Category('bars', cafesAndRestaurants));
    categories.push(new Category('cafes', cafesAndRestaurants));
    categories.push(new Category('restaurants', cafesAndRestaurants));
    categories.push(new Category('fastFood', cafesAndRestaurants));

    let billsAndUtilities = new Category('bills_and_utilities');
    categories.push(billsAndUtilities);
    categories.push(new Category('rent', billsAndUtilities));
    categories.push(new Category('internet', billsAndUtilities));
    categories.push(new Category('phone', billsAndUtilities));
    categories.push(new Category('water', billsAndUtilities));
    categories.push(new Category('gas', billsAndUtilities));
    categories.push(new Category('electricity', billsAndUtilities));
    categories.push(new Category('television', billsAndUtilities));

    let shopping = new Category('shopping');
    categories.push(shopping);
    categories.push(new Category('clothing', shopping));
    categories.push(new Category('electronics', shopping));
    categories.push(new Category('care', shopping));

    let others = new Category('others');
    categories.push(others);

    return categories;
  };
}
