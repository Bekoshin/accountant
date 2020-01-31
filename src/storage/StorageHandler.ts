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

  public deleteCategoriesFromRepo = async (categories: Category[]) => {
    if (this._categoryRepo) {
      let childCategories: Category[] = [];
      for (let category of categories) {
        if (category.childCategories && category.childCategories.length > 0) {
          await this._categoryRepo.remove(category.childCategories);
          await this._categoryRepo.remove(category);
        } else {
          childCategories.push(category);
        }
        await this._categoryRepo.remove(childCategories);
      }

      console.log('CATGORIES SUCCESSFUL DELETED');
    }
  };

  static createDefaultCategories = () => {
    let categories: Category[] = [];

    let transport = new Category('transport', true);
    categories.push(transport);
    categories.push(new Category('taxi', true, transport, IMAGES.TAXI));
    categories.push(new Category('subway', true, transport, IMAGES.SUBWAY));
    categories.push(
      new Category('transport_card', true, transport, IMAGES.TRANSPORT_CARD),
    );
    categories.push(new Category('petrol', true, transport, IMAGES.PETROL));

    let entertainment = new Category('entertainment', true);
    categories.push(entertainment);
    categories.push(new Category('concerts_and_theaters', true, entertainment));
    categories.push(new Category('games', true, entertainment, IMAGES.GAMES));
    categories.push(new Category('movies', true, entertainment, IMAGES.MOVIE));

    let health = new Category('health', true);
    categories.push(health);
    categories.push(new Category('fitness', true, health, IMAGES.FITNESS));
    categories.push(new Category('pharmacy', true, health, IMAGES.PHARMACY));
    categories.push(new Category('doctor', true, health, IMAGES.DOCTOR));

    let cafesAndRestaurants = new Category('cafes_and_restaurants', true);
    categories.push(cafesAndRestaurants);
    categories.push(
      new Category('bars', true, cafesAndRestaurants, IMAGES.BARS),
    );
    categories.push(
      new Category('cafes', true, cafesAndRestaurants, IMAGES.CAFES),
    );
    categories.push(
      new Category(
        'restaurants',
        true,
        cafesAndRestaurants,
        IMAGES.RESTAURANTS,
      ),
    );
    categories.push(
      new Category('fast_food', true, cafesAndRestaurants, IMAGES.FAST_FOOD),
    );

    let billsAndUtilities = new Category('bills_and_utilities', true);
    categories.push(billsAndUtilities);
    categories.push(new Category('rent', true, billsAndUtilities, IMAGES.RENT));
    categories.push(
      new Category('internet', true, billsAndUtilities, IMAGES.INTERNET),
    );
    categories.push(
      new Category('phone', true, billsAndUtilities, IMAGES.PHONE),
    );
    categories.push(
      new Category('water', true, billsAndUtilities, IMAGES.WATER),
    );
    categories.push(new Category('gas', true, billsAndUtilities, IMAGES.GAS));
    categories.push(
      new Category('electricity', true, billsAndUtilities, IMAGES.ELECTRICITY),
    );
    categories.push(
      new Category('television', true, billsAndUtilities, IMAGES.TV),
    );

    let shopping = new Category('shopping', true);
    categories.push(shopping);
    categories.push(new Category('household', true, shopping));
    categories.push(new Category('clothing', true, shopping));
    categories.push(new Category('electronics', true, shopping));
    categories.push(new Category('care', true, shopping));
    categories.push(new Category('products', true, shopping));

    let others = new Category('others', true);
    categories.push(others);

    return categories;
  };
}
