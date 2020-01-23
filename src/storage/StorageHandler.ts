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
import IMAGES from '../images';
import Product from '../entities/Product';

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
    await this.initCategoryRepo();
    await this.initOperationRepo();
  };

  public connect = async () => {
    this._connection = await createConnection({
      type: 'react-native',
      database: DATABASE_NAME,
      location: 'default',
      logging: ['error', 'query', 'schema'],
      migrations: [Init1576240262448, InsertDefaultValues1576410388275],
      migrationsRun: true,
      entities: [Category, Operation, Product],
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
      operations = await this._operationRepo
        .createQueryBuilder('o')
        .leftJoinAndSelect('o._category', 'c')
        .addOrderBy('o._date', 'DESC')
        .getMany();
    }
    return operations;
  };

  public getAllCategoriesFromRepo = async (): Promise<Category[]> => {
    let categories: Category[] = [];
    if (this._categoryRepo) {
      categories = await this._categoryRepo
        .createQueryBuilder('category')
        .leftJoinAndSelect('category._parentCategory', 'pc')
        .leftJoinAndSelect('category._childCategories', 'cc')
        .getMany();
    }
    return categories;
  };

  public saveCategoryInRepo = async (category: Category) => {
    if (this._categoryRepo) {
      await this._categoryRepo.save(category);
    }
  };

  public saveOperationInRepo = async (operation: Operation) => {
    if (this._operationRepo) {
      await this._operationRepo.save(operation);
    }
  };

  static createDefaultCategories = () => {
    let categories: Category[] = [];

    let transport = new Category('transport');
    categories.push(transport);
    categories.push(new Category('taxi', transport, IMAGES.TAXI));
    categories.push(new Category('subway', transport, IMAGES.SUBWAY));
    categories.push(
      new Category('transport_card', transport, IMAGES.TRANSPORT_CARD),
    );
    categories.push(new Category('petrol', transport, IMAGES.PETROL));

    let entertainment = new Category('entertainment');
    categories.push(entertainment);
    categories.push(new Category('concerts_and_theaters', entertainment));
    categories.push(new Category('games', entertainment, IMAGES.GAMES));
    categories.push(new Category('movies', entertainment, IMAGES.MOVIE));

    let health = new Category('health');
    categories.push(health);
    categories.push(new Category('fitness', health, IMAGES.FITNESS));
    categories.push(new Category('pharmacy', health, IMAGES.PHARMACY));
    categories.push(new Category('doctor', health, IMAGES.DOCTOR));

    let cafesAndRestaurants = new Category('cafes_and_restaurants');
    categories.push(cafesAndRestaurants);
    categories.push(new Category('bars', cafesAndRestaurants, IMAGES.BARS));
    categories.push(new Category('cafes', cafesAndRestaurants, IMAGES.CAFES));
    categories.push(
      new Category('restaurants', cafesAndRestaurants, IMAGES.RESTAURANTS),
    );
    categories.push(
      new Category('fast_food', cafesAndRestaurants, IMAGES.FAST_FOOD),
    );

    let billsAndUtilities = new Category('bills_and_utilities');
    categories.push(billsAndUtilities);
    categories.push(new Category('rent', billsAndUtilities, IMAGES.RENT));
    categories.push(
      new Category('internet', billsAndUtilities, IMAGES.INTERNET),
    );
    categories.push(new Category('phone', billsAndUtilities, IMAGES.PHONE));
    categories.push(new Category('water', billsAndUtilities, IMAGES.WATER));
    categories.push(new Category('gas', billsAndUtilities, IMAGES.GAS));
    categories.push(
      new Category('electricity', billsAndUtilities, IMAGES.ELECTRICITY),
    );
    categories.push(new Category('television', billsAndUtilities, IMAGES.TV));

    let shopping = new Category('shopping');
    categories.push(shopping);
    categories.push(new Category('household', shopping));
    categories.push(new Category('clothing', shopping));
    categories.push(new Category('electronics', shopping));
    categories.push(new Category('care', shopping));
    categories.push(new Category('products', shopping));

    let others = new Category('others');
    categories.push(others);

    return categories;
  };
}
