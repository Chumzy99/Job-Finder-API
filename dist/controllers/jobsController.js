"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Job_1 = __importDefault(require("../models/Job"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const getAllJobs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let jobs;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "job-seeker") {
        // For a job seeker, get back all jobs
        jobs = yield Job_1.default.find().sort("createdAt");
    }
    else {
        // For an employer, get back only his/her jobs//
        jobs = yield Job_1.default.find({ createdBy: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId }).sort("createdAt");
    }
    res.status(200).json({
        status: "success",
        count: jobs.length,
        jobs,
    });
}));
const getEveryJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Using query params to filter query;
    const queryObj = Object.assign({}, req.query);
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let query = Job_1.default.find(queryObj).sort("createdAt");
    // finally awaiting query after filtering
    let jobs = yield query;
    // const jobs = await Job.find().where("languageCategory").equals("node");
    res.status(200).json({
        status: "success",
        count: jobs.length,
        jobs,
    });
}));
const getJob = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let job;
    let { user, params: { id: jobId }, } = req;
    // ensuring that an employer can only find his/her job.
    if ((user === null || user === void 0 ? void 0 : user.role) === "employer") {
        job = yield Job_1.default.findOne({
            _id: jobId,
            createdBy: user === null || user === void 0 ? void 0 : user.userId,
        });
    }
    else {
        job = yield Job_1.default.findOne({ _id: jobId });
    }
    if (!job) {
        return next(new appError_1.default(`No job with id ${jobId}`, 404));
    }
    res.status(200).json({
        status: "success",
        job,
    });
}));
const createJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    // adding the created by field manually, since it is not passed with the request body.
    req.body.createdBy = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId;
    const job = yield Job_1.default.create(req.body);
    res.status(201).json({
        status: "success",
        job,
    });
}));
const updateJob = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { user, params: { id: jobId }, } = req;
    // taking account of who created the job before updating.
    const job = yield Job_1.default.findByIdAndUpdate({ _id: jobId, createdBy: user === null || user === void 0 ? void 0 : user.userId }, req.body, {
        new: true,
        runValidators: true,
    });
    if (!job) {
        return next(new appError_1.default(`No job with id ${jobId}`, 404));
    }
    res.status(200).json({
        status: "success",
        job,
    });
}));
const deleteJob = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { user, params: { id: jobId }, } = req;
    // ensuring that employers can only delete their own jobs.
    const job = yield Job_1.default.findOneAndRemove({
        _id: jobId,
        createdBy: user === null || user === void 0 ? void 0 : user.userId,
    });
    if (!job) {
        return next(new appError_1.default(`No job with id ${jobId}`, 404));
    }
    res.status(200).send({
        status: "success",
    });
}));
exports.default = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    getEveryJob,
};
