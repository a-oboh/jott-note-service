import dotenv from "dotenv";
import redis from "redis";
import { promisifyAll } from "bluebird";

import { logger } from "./util/logger";
import { createTypeOrmConnection } from "./util/typeOrmConnection";
import { app } from "./app";
import { MQService } from "./services/MQservice";
import { Connection } from "typeorm";

dotenv.config();

async function connectDb(): Promise<Connection> {
  return new Promise<Connection>((resolve, reject) => {
    try {
      if (process.env.NODE_ENV == "development") {
        createTypeOrmConnection().then(async (conn) => {
          await conn.runMigrations();
          resolve(conn);
        });
        logger.debug("Dev database connected");
      } else if (process.env.NODE_ENV == "test") {
        // await createTypeOrmConnection()
        // .then(
        //   async (conn) => await conn.runMigrations()
        // );
        logger.debug("Test database connected");
      } else {
        createTypeOrmConnection().then(async (conn) => {
          await conn.runMigrations();
          resolve(conn);
        });
        logger.debug("Database connected");
      }
    } catch (error) {
      logger.error(error);
      reject(error)
    }
  });
}

const connectMq = async () => {
  try {
    await mqSvc.createMqConnection().then((val) => {
      console.log(val);
    });
  } catch (error) {
    logger.error(error);
  }
};

// const redisClient = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT });

const mqSvc = MQService.getInstance();

connectDb()
  .then((conn) => {
    app;
  })
  .catch((error) => {
    logger.error(error);
  });

connectMq();

// app;

export { connectDb };
