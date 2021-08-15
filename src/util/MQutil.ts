import { Channel } from "amqplib/callback_api";
import { AuthService } from "../services/auth/authService";
import { UserService } from "../services/userService";
import { logger } from "./logger";

// const mqSvc = MQService.getInstance();

const authSvc = new AuthService(new UserService());

enum QueueEnum {
  userExchange = "user_exchange",
  userCreated = "user_created",
}

function consumeUserCreated(chan: Channel): void {
  chan.assertExchange(QueueEnum.userExchange, "direct", {
    durable: true,
  });

  chan.assertQueue(QueueEnum.userCreated, {}, function (err3, q) {
    if (err3) {
      logger.error(err3);
      throw err3;
    }

    chan.bindQueue(q.queue, QueueEnum.userExchange, QueueEnum.userCreated);
    // this.chan.bindQueue(q.queue, QueueEnum.userExchange, "");

    chan.consume(
      q.queue,
      async (msg) => {
        if (msg.content) {
          logger.info(" [x] %s", msg.content.toString());
          try {
            const eventUserData = JSON.parse(msg.content.toString());

            await authSvc.replicateUserEvent(eventUserData);

            chan.ack(msg);
          } catch (err) {
            logger.error(err);
            chan.reject(msg, true);
          }
        }
      },
      { noAck: false }
    );
  });
}

export { QueueEnum, consumeUserCreated };
