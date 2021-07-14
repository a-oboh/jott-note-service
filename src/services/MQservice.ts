/* eslint-disable @typescript-eslint/no-empty-function */
import * as amqp from "amqplib/callback_api";
import { logger } from "util/logger";
import { consumeUserCreated, QueueEnum } from "util/MQutil";
import { currentConfig as config, currentConfig } from "../config/index";

export class MQService {
  CONN_URL = currentConfig.app.rabbitMqUrl;
  chan: amqp.Channel;
  amqpConn: amqp.Connection = null;

  offlinePubQueue = [];

  private static instance: MQService;

  private constructor() {}

  public static getInstance(): MQService {
    if (!MQService.instance) {
      MQService.instance = new MQService();
    }

    return MQService.instance;
  }

  createMqConnection = async (): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      amqp.connect(this.CONN_URL, (err1, conn) => {
        if (err1) {
          logger.error(err1);
          reject(err1);
          setTimeout(this.createMqConnection, 1000);
        }

        this.amqpConn = conn;

        this.startPublisher();
        this.startWorker();

        resolve("mq connected");
      });

      process.on("beforeExit", () => {
        this.amqpConn.close();
        console.log(`Closing rabbitmq channel`);
      });
    });
  };

  startPublisher(): void {
    this.amqpConn.createConfirmChannel((err2, channel: amqp.Channel) => {
      if (err2) {
        logger.error(err2);
        // reject(err2);
        // throw err2;
      }

      this.chan = channel;
    });
  }

  startWorker(): void {
    this.amqpConn.createChannel((err, ch) => {
      if (err) {
        logger.error(err);
        // throw err;
      }

      ch.prefetch(20);

      consumeUserCreated(ch);
    });
  }

  processMsg(msg: amqp.Message): void {
    this.work(msg, function (ok) {
      try {
        if (ok) this.chan.ack(msg);
        else this.chan.reject(msg, true);
      } catch (e) {
        // closeOnErr(e);
      }
    });
  }

  work(msg: amqp.Message, cb: (ok: boolean) => any): void {
    cb(true);
  }

  publishToQueue = async (
    queueName: string,
    data: string | Uint8Array
  ): Promise<void> => {
    this.chan.sendToQueue(queueName, Buffer.from(data));
  };

  publishDirect = async (
    exchangeName: string,
    routingKey: string,
    data: string | Uint8Array
  ): Promise<void> => {
    try {
      this.chan.publish(exchangeName, routingKey, Buffer.from(data), {
        persistent: true,
      });
    } catch (err) {
      logger.error(err);
      this.offlinePubQueue.push([exchangeName, routingKey, data]);
      throw err;
    }
  };

  consumeQueue = async (
    queueName: string,
    onMessage: (msg: amqp.Message) => void,
    queueOptions?: amqp.Options.AssertQueue
  ): Promise<void> => {
    this.chan.assertQueue(queueName, queueOptions);

    this.chan.consume(queueName, onMessage);
  };
}
