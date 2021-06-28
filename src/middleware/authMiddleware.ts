import { User } from "../entities/user";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = (req.headers["x-access-token"] ||
    req.headers["authorization"]) as string;

  if (token) {
    if (token.startsWith("Bearer ")) {
      // Remove `Bearer` from string
      token = token.slice(7, token.length).trimLeft();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded: User) => {
      if (err) {
        return res.status(401).json({
          status: "error",
          message: "Token is not valid",
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      status: "error",
      message: "Check access token",
    });
  }
};
