import express, { Application, Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

const handleCastErrorDB = function (err: { path: any; value: any }) {
  const message = `Invalid ${err.path}: ${err.value}`;
  console.log(message);
  return new AppError(message, 400);
};

export = (err: any, req: Request, res: Response, next: NextFunction) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  if (error.name === "CastError") error = handleCastErrorDB(error);

  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error("ERROR 💥", error._message);

    res.status(500).json({
      status: "error",
      message: error._message,
    });
  }
};
