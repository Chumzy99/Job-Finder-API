import express, { Application, Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";
import { CustomRequest } from "../models/custom";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

const getAllUsers = catchAsync(async (req: CustomRequest, res: Response) => {
  let users = await User.find();

  res.status(200).json({
    status: "success",
    count: users.length,
    users,
  });
});

const getUser = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let {
      params: { id: userId },
    } = req;

    let user = await User.findOne({ _id: userId });

    if (!user) {
      return next(new AppError(`No user with id ${userId}`, 404));
    }

    res.status(200).json({
      status: "success",
      user,
    });
  }
);

const updateUser = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let {
      params: { id: userId },
    } = req;

    // let newName = req.body.fullname ? req.body.fullname : null;

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { fullname: req.body.fullname },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return next(new AppError(`No user with id ${userId}`, 404));
    }

    res.status(200).json({
      status: "success",
      user,
    });
  }
);

const deleteUser = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let {
      params: { id: userId },
    } = req;

    const user = await User.findOneAndRemove({
      _id: userId,
    });

    if (!user) {
      return next(new AppError(`No user with id ${userId}`, 404));
    }

    res.status(200).send({
      status: "success",
      message: `User ${userId} deleted`,
    });
  }
);

export default {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
