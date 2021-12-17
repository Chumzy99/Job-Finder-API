import express, { Application, Request, Response, NextFunction } from "express";
import Job from "../models/Job";
import { CustomRequest } from "../models/custom";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

const getAllJobs = catchAsync(async (req: CustomRequest, res: Response) => {
  let jobs;
  if (req.user?.role === "job-seeker") {
    // For a job seeker, get back all jobs
    jobs = await Job.find().sort("createdAt");
  } else {
    // For an employer, get back only his/her jobs//
    jobs = await Job.find({ createdBy: req.user?.userId }).sort("createdAt");
  }
  res.status(200).json({
    status: "success",
    count: jobs.length,
    jobs,
  });
});

const getEveryJob = catchAsync(async (req: CustomRequest, res: Response) => {
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  let query = Job.find(queryObj).sort("createdAt");

  let jobs = await query;

  // const jobs = await Job.find().where("languageCategory").equals("node");

  res.status(200).json({
    status: "success",
    count: jobs.length,
    jobs,
  });
});

const getJob = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let job;
    let {
      user,
      params: { id: jobId },
    } = req;

    if (user?.role === "employer") {
      job = await Job.findOne({
        _id: jobId,
        createdBy: user?.userId,
      });
    } else {
      job = await Job.findOne({ _id: jobId });
    }

    if (!job) {
      return next(new AppError(`No job with id ${jobId}`, 404));
    }

    res.status(200).json({
      status: "success",
      job,
    });
  }
);

const createJob = catchAsync(async (req: CustomRequest, res: Response) => {
  req.body.createdBy = req.user?.userId;
  const job = await Job.create(req.body);
  res.status(201).json({
    status: "success",
    job,
  });
});

const updateJob = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let {
      user,
      params: { id: jobId },
    } = req;

    const job = await Job.findByIdAndUpdate(
      { _id: jobId, createdBy: user?.userId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!job) {
      return next(new AppError(`No job with id ${jobId}`, 404));
    }
    res.status(200).json({
      status: "success",
      job,
    });
  }
);

const deleteJob = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let {
      user,
      params: { id: jobId },
    } = req;

    const job = await Job.findOneAndRemove({
      _id: jobId,
      createdBy: user?.userId,
    });

    if (!job) {
      return next(new AppError(`No job with id ${jobId}`, 404));
    }

    res.status(200).send({
      status: "success",
    });
  }
);

export default {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getEveryJob,
};
