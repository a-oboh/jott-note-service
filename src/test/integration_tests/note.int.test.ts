// import request from "supertest";
// import { app } from "app";
// import {
//   closeConnection,
//   createTestUsers,
//   cleanDb,
//   connectTestDb,
// } from "../../util/typeOrmConnection";
// import { RouteEnum } from "../../util/routeEnum";
// import { JwtService } from "services/auth/jwtService";
// import { RedisService } from "services/redis/redisService";
// import { User } from "entity/user";

// describe("note integration tests", () => {
//   let token: string;
//   let user: User;

//   beforeAll(async () => {
//     await connectTestDb().then(async () => {
//       const jwtSvc = new JwtService();

//       user = await createTestUsers();

//       token = jwtSvc.createToken({
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//       });
//     });
//   });

//   afterAll(async () => {
//     await cleanDb().then(async () => {
//       await closeConnection();
//     });

//     await new RedisService().close();
//   });

//   it("[POST] should create a new note", async () => {
//     await request(app)
//       .post(`${RouteEnum.NoteRoute}/create-note`)
//       .set("Authorization", "Bearer " + token)
//       .set({ "x-idempotent-key": "a1" })
//       .send({
//         title: "test note",
//         content: "# h1 Heading 5! 8-)",
//       })
//       .then((result) => {
//         expect([201, 304]).toContain(result.status);
//       });
//   });

//   it("[GET] should get all user notes", async () => {
//     await request(app)
//       .get(`${RouteEnum.NoteRoute}/get-notes/${user.id}`)
//       .set("Authorization", "Bearer " + token)
//       .then((res) => {
//         expect(res.status).toBe(200);
//         expect(res.body.status).toBe('success');
//       });
//   });
// });
