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
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.create(Object.assign({}, req.body));
    const token = user.createJWT();
    res.status(201).json({
        status: "success",
        token,
        user: { name: user.fullname, role: user.role },
    });
}));
const login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.default("Please provide email and password", 400));
    }
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        return next(new appError_1.default("Invalid Credentials", 401));
    }
    const isPasswordCorrect = yield user.comparePassword(password);
    if (!isPasswordCorrect) {
        return next(new appError_1.default("Invalid Credentials", 401));
    }
    const token = user.createJWT();
    res.status(200).json({
        status: "success",
        user: { fullname: user.fullname, role: user.role },
        token,
    });
}));
const authProtect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return next(new appError_1.default("Authentication invalid", 401));
    }
    const token = authHeader.split(" ")[1];
    let payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    let { userId } = payload;
    const { role, fullname } = yield User_1.default.findOne({ _id: userId }).select("-password");
    req.user = { userId, fullname, role };
    next();
}));
exports.default = {
    register,
    login,
    authProtect,
};
