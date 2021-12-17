import express, { Application, Request, Response, NextFunction } from "express";
import User from "../models/User";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../models/custom";

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: any = await User.create({ ...req.body });
    const token = user.createJWT();

    res.status(201).json({
      status: "success",
      token,
      user: { name: user.fullname, role: user.role },
    });
  }
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("Invalid Credentials", 401));
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return next(new AppError("Invalid Credentials", 401));
    }

    const token = user.createJWT();
    res.status(200).json({
      status: "success",
      user: { fullname: user.fullname, role: user.role },
      token,
    });
  }
);

const authProtect = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return next(new AppError("Authentication invalid", 401));
    }

    const token = authHeader.split(" ")[1];
    let payload = jwt.verify(token, process.env.JWT_SECRET as any);

    let { userId }: any = payload;
    const { role, fullname } = await User.findOne({ _id: userId }).select(
      "-password"
    );

    req.user = { userId, fullname, role };

    next();
  }
);

export default {
  register,
  login,
  authProtect,
};
