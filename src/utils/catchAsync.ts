import express, { Application, Request, Response, NextFunction } from "express";

export = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
