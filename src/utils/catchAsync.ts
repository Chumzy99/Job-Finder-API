import express, { Application, Request, Response, NextFunction } from "express";

// catchAsync function to catch errors from the controllers.
export = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
