import dotenv from "dotenv";
import redis from "redis";
import { promisifyAll } from "bluebird";

import { logger } from "./util/logger";
import { createTypeOrmConnection } from "./util/typeOrmConnection";
import { app } from "app";
import { MQService } from "services/MQservice";

dotenv.config();

async function connectDb() {
  try {
    if (process.env.NODE_ENV == "development") {
      await createTypeOrmConnection().then(
        async (conn) => await conn.runMigrations()
      );
      logger.debug("Dev database connected");
    } else if (process.env.NODE_ENV == "test") {
      // await createTypeOrmConnection()
      // .then(
      //   async (conn) => await conn.runMigrations()
      // );
      logger.debug("Test database connected");
    } else {
      await createTypeOrmConnection().then(
        async (conn) => await conn.runMigrations()
      );
      logger.debug("Database connected");
    }
  } catch (error) {
    logger.error(error);
  }
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

promisifyAll(redis);

// const redisClient = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT });

const mqSvc = MQService.getInstance();

connectDb();

connectMq();

app;
