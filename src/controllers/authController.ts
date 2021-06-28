import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth/authService";
import { BadRequest, handleError, HttpError } from "../util/httpError";
import { User } from "../entities/user";
import { bodyEmpty } from "../util/util";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    if (bodyEmpty(req)) {
      return next(new BadRequest("body cannot be empty"));
    }

    const newUser = new User();

    newUser.email = req.body.email;
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.password = req.body.password;
    newUser.photoUrl = null;
    newUser.firebaseUuid = null;

    try {
      const user = await this.authService.register(newUser);

      return res.send({
        status: "success",
        message: "registered user successfully",
        data: user,
      });
    } catch (err) {
      return next(err);
    }
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | any> {
    if (bodyEmpty(req)) {
      return next(new BadRequest("body cannot be empty"));
    }

    const { email, password } = req.body;

    try {
      const user = await this.authService.login(email, password);

      return res.send({
        status: "success",
        message: "login successful",
        data: user,
      });
    } catch (err) {
      return next(err);
    }
  }

  async firebaseRegister(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | any> {
    if (bodyEmpty(req)) {
      return next(new BadRequest("body cannot be empty"));
    }

    const newUser = new User();

    newUser.email = req.body.email;
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.firebaseUuid = req.body.firebaseUuid;
    newUser.photoUrl = req.body.photoUrl;

    try {
      const user = await this.authService.firebaseRegister(newUser);

      return res.send({
        status: "success",
        message: "registered user successfully",
        data: user,
      });
    } catch (err) {
      return next(err);
    }
  }

  async firebaseGetUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Request | any> {
    if (bodyEmpty(req)) {
      return next(new BadRequest("body cannot be empty"));
    }

    const firebaseUuid = req.body.firebaseUuid;

    try {
      const user = await this.authService.getUser(firebaseUuid);

      return res.send({
        status: "success",
        message: "registered user successfully",
        data: user,
      });
    } catch (err) {
      return next(err);
    }
  }
}
