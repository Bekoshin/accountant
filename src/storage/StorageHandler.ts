import {
  Connection,
  createConnection,
  getRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm/browser';
import Category from '../entities/Category';
import Operation from '../entities/Operation';
import {Init1576240262448} from './migrations/1576240262448-Init';
import {InsertDefaultValues1576410388275} from './migrations/1576410388275-InsertDefaultValues';
import IMAGES from '../images';
import Product from '../entities/Product';
import {Filter} from '../entities/Filter';
import Subscription from '../entities/Subscription';

const DATABASE_NAME = 'main.db';

export default class StorageHandler {
  private _connection: Connection | undefined;

  private _categoryRepo: Repository<Category> | undefined;
  private _operationRepo: Repository<Operation> | undefined;
  private _subscriptionRepo: Repository<Subscription> | undefined;

  constructor() {
    this._connection = undefined;
  }

  public connect = async () => {
    this._connection = await createConnection({
      type: 'react-native',
      database: DATABASE_NAME,
      location: 'default',
      logging: ['error', 'query', 'schema'],
      migrations: [Init1576240262448, InsertDefaultValues1576410388275],
      migrationsRun: true,
      entities: [Category, Operation, Product, Subscription],
    });
  };

  public initCategoryRepo = () => {
    this._categoryRepo = getRepository(Category);
  };

  public initOperationRepo = () => {
    this._operationRepo = getRepository(Operation);
  };

  public initSubscriptionRepo = () => {
    this._subscriptionRepo = getRepository(Subscription);
  };

  public getAllOperations = async (): Promise<Operation[]> => {
    let operations: Operation[] = [];
    if (this._operationRepo) {
      operations = await this._operationRepo
        .createQueryBuilder('o')
        .leftJoinAndSelect('o._category', 'c')
        .leftJoinAndSelect('c._parentCategory', 'pc')
        .leftJoinAndSelect('c._childCategories', 'cc')
        .addOrderBy('o._timestamp', 'DESC')
        .getMany();
    }
    return operations;
  };

  public getFilteredOperations = async (
    filter: Filter,
  ): Promise<Operation[]> => {
    let operations: Operation[] = [];
    if (this._operationRepo) {
      let builder: SelectQueryBuilder<
        Operation
      > = this._operationRepo.createQueryBuilder('o');

      if (filter.categories.length > 0) {
        builder.where('o.category_id IN (:...categories)', {
          categories: filter.categories.map(category => category.id),
        });
      }

      if (filter.amountFrom !== undefined && filter.amountTo !== undefined) {
        builder.where('o.amount BETWEEN :amount_from AND :amount_to', {
          amount_from: filter.amountFrom,
          amount_to: filter.amountTo,
        });
      } else if (filter.amountFrom !== undefined) {
        builder.where('o.amount >= :amount_from', {
          amount_from: filter.amountFrom,
        });
      } else if (filter.amountTo !== undefined) {
        builder.where('o.amount <= :amount_to', {
          amount_to: filter.amountTo,
        });
      }

      if (filter.dateFrom !== undefined && filter.dateTo !== undefined) {
        const timestampFrom = filter.dateFrom.setHours(0, 0, 0, 0);
        const timestampTo = filter.dateTo.setHours(23, 59, 59, 999);
        builder.where('o.timestamp BETWEEN :timestamp_from AND :timestamp_to', {
          timestamp_from: timestampFrom,
          timestamp_to: timestampTo,
        });
      } else if (filter.dateFrom !== undefined) {
        const timestampFrom = filter.dateFrom.setHours(0, 0, 0, 0);
        builder.where('o.timestamp >= :timestamp_from', {
          timestamp_from: timestampFrom,
        });
      } else if (filter.dateTo !== undefined) {
        const timestampTo = filter.dateTo.setHours(23, 59, 59, 999);
        builder.where('o.timestamp <= :timestamp_to', {
          timestamp_to: timestampTo,
        });
      }

      if (filter.note !== '') {
        builder.where('INSTR(o.note, :note)', {note: filter.note});
      }

      if (filter.subscriptionId !== undefined) {
        builder.where('o.subscription_id = :subscription_id', {
          subscription_id: filter.subscriptionId,
        });
      }

      operations = await builder
        .leftJoinAndSelect('o._category', 'c')
        .leftJoinAndSelect('c._parentCategory', 'pc')
        .leftJoinAndSelect('c._childCategories', 'cc')
        .addOrderBy('o._timestamp', 'DESC')
        .getMany();
    }
    return operations;
  };

  public getAllValidCategories = async (): Promise<Category[]> => {
    let categories: Category[] = [];
    if (this._categoryRepo) {
      categories = await this._categoryRepo
        .createQueryBuilder('category')
        .where('category.is_valid = :is_valid', {is_valid: 1})
        .leftJoinAndSelect('category._parentCategory', 'pc')
        .leftJoinAndSelect('category._childCategories', 'cc')
        .getMany();
    }
    return categories;
  };

  public saveCategory = async (category: Category) => {
    if (this._categoryRepo) {
      await this._categoryRepo.save(category);
    }
  };

  public saveOperation = async (operation: Operation) => {
    if (this._operationRepo) {
      await this._operationRepo.save(operation);
    }
  };

  public saveSubscription = async (subscription: Subscription) => {
    if (this._subscriptionRepo) {
      await this._subscriptionRepo.save(subscription);
    }
  };

  public markCategoriesInvalid = async (categories: Category[]) => {
    if (this._categoryRepo) {
      const invalidCategories: Category[] = categories.map(category => {
        category.isValid = false;
        return category;
      });
      await this._categoryRepo.save(invalidCategories);
      console.log('CATEGORIES SUCCESSFUL DELETED');
    }
  };

  public deleteOperation = async (operation: Operation) => {
    if (this._operationRepo) {
      await this._operationRepo.remove(operation);
    }
  };

  public getAllSubscriptions = async (): Promise<Subscription[]> => {
    let subscriptions: Subscription[] = [];
    if (this._subscriptionRepo) {
      subscriptions = await this._subscriptionRepo
        .createQueryBuilder('s')
        .leftJoinAndSelect('s._category', 'c')
        .leftJoinAndSelect('c._parentCategory', 'pc')
        .leftJoinAndSelect('c._childCategories', 'cc')
        .addOrderBy('s._day', 'ASC')
        .getMany();
    }
    return subscriptions;
  };

  static createDefaultCategories = () => {
    let categories: Category[] = [];

    let transport = new Category('transport', true);
    categories.push(transport);
    categories.push(new Category('taxi', true, true, transport, IMAGES.TAXI));
    categories.push(
      new Category('subway', true, true, transport, IMAGES.SUBWAY),
    );
    categories.push(
      new Category(
        'transport_card',
        true,
        true,
        transport,
        IMAGES.TRANSPORT_CARD,
      ),
    );
    categories.push(
      new Category('petrol', true, true, transport, IMAGES.PETROL),
    );

    let entertainment = new Category('entertainment', true);
    categories.push(entertainment);
    categories.push(
      new Category('concerts_and_theaters', true, true, entertainment),
    );
    categories.push(
      new Category('games', true, true, entertainment, IMAGES.GAMES),
    );
    categories.push(
      new Category('movies', true, true, entertainment, IMAGES.MOVIE),
    );

    let health = new Category('health', true);
    categories.push(health);
    categories.push(
      new Category('fitness', true, true, health, IMAGES.FITNESS),
    );
    categories.push(
      new Category('pharmacy', true, true, health, IMAGES.PHARMACY),
    );
    categories.push(new Category('doctor', true, true, health, IMAGES.DOCTOR));

    let cafesAndRestaurants = new Category('cafes_and_restaurants', true);
    categories.push(cafesAndRestaurants);
    categories.push(
      new Category('bars', true, true, cafesAndRestaurants, IMAGES.BARS),
    );
    categories.push(
      new Category('cafes', true, true, cafesAndRestaurants, IMAGES.CAFES),
    );
    categories.push(
      new Category(
        'restaurants',
        true,
        true,
        cafesAndRestaurants,
        IMAGES.RESTAURANTS,
      ),
    );
    categories.push(
      new Category(
        'fast_food',
        true,
        true,
        cafesAndRestaurants,
        IMAGES.FAST_FOOD,
      ),
    );

    let billsAndUtilities = new Category('bills_and_utilities', true);
    categories.push(billsAndUtilities);
    categories.push(
      new Category('rent', true, true, billsAndUtilities, IMAGES.RENT),
    );
    categories.push(
      new Category('internet', true, true, billsAndUtilities, IMAGES.INTERNET),
    );
    categories.push(
      new Category('phone', true, true, billsAndUtilities, IMAGES.PHONE),
    );
    categories.push(
      new Category('water', true, true, billsAndUtilities, IMAGES.WATER),
    );
    categories.push(
      new Category('gas', true, true, billsAndUtilities, IMAGES.GAS),
    );
    categories.push(
      new Category(
        'electricity',
        true,
        true,
        billsAndUtilities,
        IMAGES.ELECTRICITY,
      ),
    );
    categories.push(
      new Category('television', true, true, billsAndUtilities, IMAGES.TV),
    );

    let shopping = new Category('shopping', true);
    categories.push(shopping);
    categories.push(new Category('household', true, true, shopping));
    categories.push(new Category('clothing', true, true, shopping));
    categories.push(new Category('electronics', true, true, shopping));
    categories.push(new Category('care', true, true, shopping));
    categories.push(new Category('products', true, true, shopping));

    let others = new Category('others', true);
    categories.push(others);

    return categories;
  };
}
