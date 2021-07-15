// import request from "supertest";
// import { app } from "app";
// import {
//   closeConnection,
//   cleanDb,
//   connectTestDb,
// } from "../../util/typeOrmConnection";
// import { RouteEnum } from "../../util/routeEnum";
// import { RedisService } from "services/redis/redisService";

// describe("Auth integration tests", () => {
//   beforeAll(async () => {
//     await connectTestDb();
//   });

//   afterAll(async () => {
//     await cleanDb().then(async () => {
//       await closeConnection();
//     });
//     new RedisService().close();
//   });

//   it("[POST] register user", async () => {
//     await request(app)
//       .post(`${RouteEnum.AuthRoute}/register`)
//       .send({
//         email: "user@mail.com",
//         firstName: "test",
//         lastName: "user",
//         password: "password",
//       })
//       .then((result) => {
//         expect(result.status).toBe(200);
//         expect(result.body.status).toBe("success");
//       });
//   });

//   it("[POST] login user", async () => {
//     await request(app)
//       .post(`${RouteEnum.AuthRoute}/login`)
//       .send({
//         email: "user@mail.com",
//         password: "password",
//       })
//       .then((result) => {
//         expect(result.status).toBe(200);
//         expect(result.body.status).toBe("success");
//       });
//   });
// });
