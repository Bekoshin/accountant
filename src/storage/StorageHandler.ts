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
import Product from '../entities/Product';
import {Filter} from '../entities/Filter';
import Subscription from '../entities/Subscription';

const DATABASE_NAME = 'main.db';

export default class StorageHandler {
  private static _instance: StorageHandler;

  private _connection: Connection | undefined;

  private _categoryRepo: Repository<Category> | undefined;
  private _operationRepo: Repository<Operation> | undefined;
  private _subscriptionRepo: Repository<Subscription> | undefined;

  private constructor() {
    this._connection = undefined;
  }

  public static async getInstance(): Promise<StorageHandler> {
    if (!StorageHandler._instance) {
      StorageHandler._instance = new StorageHandler();
      await StorageHandler._instance.connect();
      StorageHandler._instance.initCategoryRepo();
      StorageHandler._instance.initOperationRepo();
      StorageHandler._instance.initSubscriptionRepo();
    }
    return StorageHandler._instance;
  }

  private connect = async () => {
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

  private initCategoryRepo = () => {
    this._categoryRepo = getRepository(Category);
  };

  private initOperationRepo = () => {
    this._operationRepo = getRepository(Operation);
  };

  private initSubscriptionRepo = () => {
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
      const builder: SelectQueryBuilder<
        Operation
      > = this._operationRepo.createQueryBuilder('o');
      let filtered = false;

      if (filter.categories.length > 0) {
        builder.where('o.category_id IN (:...categories)', {
          categories: filter.categories.map(category => category.id),
        });
        filtered = true;
      }

      if (filter.amountFrom !== undefined && filter.amountTo !== undefined) {
        const where = 'o.amount BETWEEN :amount_from AND :amount_to';
        const params = {
          amount_from: filter.amountFrom,
          amount_to: filter.amountTo,
        };
        if (filtered) {
          builder.andWhere(where, params);
        } else {
          builder.where(where, params);
        }
        filtered = true;
      } else if (filter.amountFrom !== undefined) {
        const where = 'o.amount >= :amount_from';
        const params = {
          amount_from: filter.amountFrom,
        };
        if (filtered) {
          builder.andWhere(where, params);
        } else {
          builder.where(where, params);
        }
        filtered = true;
      } else if (filter.amountTo !== undefined) {
        const where = 'o.amount <= :amount_to';
        const params = {
          amount_to: filter.amountTo,
        };
        if (filtered) {
          builder.andWhere(where, params);
        } else {
          builder.where(where, params);
        }
        filtered = true;
      }

      if (filter.dateFrom !== undefined && filter.dateTo !== undefined) {
        const timestampFrom = filter.dateFrom.setHours(0, 0, 0, 0);
        const timestampTo = filter.dateTo.setHours(23, 59, 59, 999);
        const where = 'o.timestamp BETWEEN :timestamp_from AND :timestamp_to';
        const params = {
          timestamp_from: timestampFrom,
          timestamp_to: timestampTo,
        };
        if (filtered) {
          builder.andWhere(where, params);
        } else {
          builder.where(where, params);
        }
        filtered = true;
      } else if (filter.dateFrom !== undefined) {
        const timestampFrom = filter.dateFrom.setHours(0, 0, 0, 0);
        const where = 'o.timestamp >= :timestamp_from';
        const params = {
          timestamp_from: timestampFrom,
        };
        if (filtered) {
          builder.andWhere(where, params);
        } else {
          builder.where(where, params);
        }
        filtered = true;
      } else if (filter.dateTo !== undefined) {
        const timestampTo = filter.dateTo.setHours(23, 59, 59, 999);
        const where = 'o.timestamp <= :timestamp_to';
        const params = {
          timestamp_to: timestampTo,
        };
        if (filtered) {
          builder.andWhere(where, params);
        } else {
          builder.where(where, params);
        }
        filtered = true;
      }

      if (filter.note !== '') {
        const where = 'INSTR(o.note, :note)';
        const params = {note: filter.note};
        if (filtered) {
          builder.andWhere(where, params);
        } else {
          builder.where(where, params);
        }
        filtered = true;
      }

      if (filter.subscriptionId !== undefined) {
        const where = 'o.subscription_id = :subscription_id';
        const params = {
          subscription_id: filter.subscriptionId,
        };
        if (filtered) {
          builder.andWhere(where, params);
        } else {
          builder.where(where, params);
        }
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

  public getCategories = async (options: {
    isValid?: boolean;
    isDefault?: boolean;
  }): Promise<Category[]> => {
    const {isValid, isDefault} = options;
    let categories: Category[] = [];
    if (this._categoryRepo) {
      const builder: SelectQueryBuilder<
        Category
      > = await this._categoryRepo.createQueryBuilder('category');

      let filtered = false;
      if (isValid !== undefined) {
        builder.where('category.is_valid = :is_valid', {is_valid: isValid});
        filtered = true;
      }
      if (isDefault !== undefined) {
        if (filtered) {
          builder.andWhere('category.is_default = :is_default', {
            is_default: isDefault,
          });
        } else {
          builder.where('category.is_default = :is_default', {
            is_default: isDefault,
          });
        }
      }

      categories = await builder
        .leftJoinAndSelect('category._parentCategory', 'pc')
        .leftJoinAndSelect('category._childCategories', 'cc')
        .orderBy('category._id', 'ASC')
        .addOrderBy('cc._id', 'ASC')
        .getMany();
    }
    return categories;
  };

  public saveCategory = async (category: Category) => {
    if (this._categoryRepo) {
      await this._categoryRepo.save(category);
    }
  };

  public saveCategories = async (categories: Category[]) => {
    if (this._categoryRepo) {
      await this._categoryRepo.save(categories);
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

  public wipeAllData = async () => {
    if (this._operationRepo) {
      await this._operationRepo.clear();
    }
    if (this._subscriptionRepo) {
      await this._subscriptionRepo.clear();
    }
    if (this._categoryRepo) {
      await this._categoryRepo.clear();
    }
  };

  static createDefaultCategories = () => {
    let categories: Category[] = [];

    let transport = new Category(
      'transport',
      true,
      true,
      undefined,
      'train-car',
    );
    categories.push(transport);
    categories.push(new Category('taxi', true, true, transport, 'taxi'));
    categories.push(
      new Category('subway', true, true, transport, 'subway-variant'),
    );
    categories.push(
      new Category('transport_card', true, true, transport, 'credit-card'),
    );
    categories.push(
      new Category('petrol', true, true, transport, 'gas-station'),
    );
    categories.push(new Category('carsharing', true, true, transport, 'car'));

    let entertainment = new Category(
      'entertainment',
      true,
      true,
      undefined,
      'emoticon',
    );
    categories.push(entertainment);
    categories.push(new Category('movies', true, true, entertainment, 'movie'));
    categories.push(
      new Category('games', true, true, entertainment, 'google-controller'),
    );
    categories.push(
      new Category('music', true, true, entertainment, 'music-note'),
    );
    categories.push(
      new Category(
        'concerts_and_theaters',
        true,
        true,
        entertainment,
        'drama-masks',
      ),
    );

    let health = new Category('health', true, true, undefined, 'hospital');
    categories.push(health);
    categories.push(new Category('fitness', true, true, health, 'dumbbell'));
    categories.push(new Category('pharmacy', true, true, health, 'pill'));
    categories.push(new Category('doctor', true, true, health, 'doctor'));

    let cafesAndRestaurants = new Category(
      'cafes_and_restaurants',
      true,
      true,
      undefined,
      'silverware',
    );
    categories.push(cafesAndRestaurants);
    categories.push(
      new Category('fast_food', true, true, cafesAndRestaurants, 'food'),
    );
    categories.push(
      new Category('cafes', true, true, cafesAndRestaurants, 'coffee'),
    );
    categories.push(
      new Category('bars', true, true, cafesAndRestaurants, 'glass-cocktail'),
    );
    categories.push(
      new Category(
        'restaurants',
        true,
        true,
        cafesAndRestaurants,
        'silverware-fork-knife',
      ),
    );

    let billsAndUtilities = new Category(
      'bills_and_utilities',
      true,
      true,
      undefined,
      'gauge',
    );
    categories.push(billsAndUtilities);
    categories.push(
      new Category('rent', true, true, billsAndUtilities, 'home-currency-usd'),
    );
    categories.push(
      new Category('internet', true, true, billsAndUtilities, 'web'),
    );
    categories.push(
      new Category('phone', true, true, billsAndUtilities, 'cellphone'),
    );
    categories.push(
      new Category('water', true, true, billsAndUtilities, 'water-pump'),
    );
    categories.push(new Category('gas', true, true, billsAndUtilities, 'fire'));
    categories.push(
      new Category('electricity', true, true, billsAndUtilities, 'flash'),
    );
    categories.push(
      new Category('television', true, true, billsAndUtilities, 'television'),
    );

    let shopping = new Category('shopping', true, true, undefined, 'shopping');
    categories.push(shopping);
    categories.push(
      new Category('products', true, true, shopping, 'food-variant'),
    );
    categories.push(new Category('care', true, true, shopping, 'face'));
    categories.push(new Category('household', true, true, shopping, 'home'));
    categories.push(
      new Category('clothing', true, true, shopping, 'tshirt-crew'),
    );
    categories.push(
      new Category('electronics', true, true, shopping, 'laptop'),
    );

    let others = new Category('others', true);
    categories.push(others);

    return categories;
  };
}
