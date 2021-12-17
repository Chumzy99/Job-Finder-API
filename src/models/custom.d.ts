import express, { Application, Request, Response, NextFunction } from "express";

export interface CustomRequest extends Request {
  user?: {
    userId: string;
    fullname: string;
    role: string;
  };
}
