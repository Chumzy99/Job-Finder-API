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
const User_1 = __importDefault(require("../models/User"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let users = yield User_1.default.find();
    res.status(200).json({
        status: "success",
        count: users.length,
        users,
    });
}));
const getUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { params: { id: userId }, } = req;
    let user = yield User_1.default.findOne({ _id: userId });
    if (!user) {
        return next(new appError_1.default(`No user with id ${userId}`, 404));
    }
    res.status(200).json({
        status: "success",
        user,
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { params: { id: userId }, } = req;
    // let newName = req.body.fullname ? req.body.fullname : null;
    const user = yield User_1.default.findByIdAndUpdate({ _id: userId }, { fullname: req.body.fullname }, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        return next(new appError_1.default(`No user with id ${userId}`, 404));
    }
    res.status(200).json({
        status: "success",
        user,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { params: { id: userId }, } = req;
    const user = yield User_1.default.findOneAndRemove({
        _id: userId,
    });
    if (!user) {
        return next(new appError_1.default(`No user with id ${userId}`, 404));
    }
    res.status(200).send({
        status: "success",
        message: `User ${userId} deleted`,
    });
}));
exports.default = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
};
