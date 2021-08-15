import { User } from "../entities/user";
import {
  createConnection,
  getConnection,
  getConnectionOptions,
  getRepository,
  Connection,
} from "typeorm";
import { logger } from "./logger";

const createTypeOrmConnection = async (): Promise<Connection> => {
  //override connection options
  const connOptions = await getConnectionOptions(process.env.NODE_ENV);
  return await createConnection({ ...connOptions, name: "default" });
};

const connectTestDb = async (): Promise<void> => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      // await createTypeOrmConnection()
      const connOptions = await getConnectionOptions("test");
      await createConnection({ ...connOptions, name: "default" });

      resolve();
      // break;
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const closeConnection = async (): Promise<void> => {
  await getConnection().close();
};

const createTestUsers = async (): Promise<User> => {
  return new Promise<User>(async (resolve) => {
    const newUser = new User();

    newUser.email = "ayooo@test.com";
    newUser.firstName = "Ayo";
    newUser.lastName = "Balogun";
    newUser.password = "secret";

    const userRepository = getRepository(User);

    const user = userRepository.create(newUser);

    await userRepository.save(user);

    console.log("saved user");
    logger.debug('Saved user')

    resolve(user);
  });
};

const cleanDb = async (): Promise<void> => {
  return new Promise<void>(async (resolve) => {
    const entities = await getEntities();
    await cleanAll(entities);
    resolve();
  });
};

const getEntities = async () => {
  const entities = await getConnection().entityMetadatas;

  return entities;
};

const cleanAll = async (entities) => {
  try {
    for (const entity of entities) {
      const repository = getRepository(entity.name);
      // await repository.clear();
      await repository.query(`DELETE FROM \`${entity.tableName}\`;`);
      // await repository.query("SET FOREIGN_KEY_CHECKS=0;");
      // await repository.query(`DROP TABLE \`${entity.tableName}\`;`);
      // await repository.query("SET FOREIGN_KEY_CHECKS=1;");
    }
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
};

export {
  createTypeOrmConnection,
  createTestUsers,
  closeConnection,
  cleanDb,
  connectTestDb,
};
