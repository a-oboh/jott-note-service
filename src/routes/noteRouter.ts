import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware";
import checkIdempotentKey from "../middleware/idempotencyMiddleware";
import { NoteController } from "../controllers/noteController";
import { NoteService } from "../services/notes/noteService";
import { UserService } from "../services/userService";
import { RedisService } from "../services/redis/redisService";

export const noteRouter = Router();

const noteSvc = new NoteService();
const userService: UserService = new UserService();
const redisService: RedisService = new RedisService();

const noteCtrl = new NoteController(noteSvc, userService, redisService);

noteRouter.get("/get-notes/:userId", requireAuth, noteCtrl.getNotes);

noteRouter.get("/get-note/:userId/:noteId", noteCtrl.getSingleNote);

noteRouter.post("/create-note", checkIdempotentKey, noteCtrl.createNote);

noteRouter.patch("/update-note/:id", checkIdempotentKey, noteCtrl.updateNote);

noteRouter.delete("/delete-note/:noteId", noteCtrl.deleteSingleNote);
