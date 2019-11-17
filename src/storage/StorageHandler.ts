import {Connection, createConnection} from 'typeorm/browser';

const DATABASE_NAME = 'main.db';

export default class StorageHandler {
  private connection: Connection | undefined;

  constructor() {
    this.connection = undefined;
  }

  public connect = async () => {
    this.connection = await createConnection({
      type: 'react-native',
      database: DATABASE_NAME,
      location: 'default',
      logging: ['error', 'query', 'schema'],
      synchronize: true,
      entities: [],
    });
  };
}
