"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const appError_1 = __importDefault(require("../utils/appError"));
const handleCastErrorDB = function (err) {
    const message = `Invalid ${err.path}: ${err.value}`;
    console.log(message);
    return new appError_1.default(message, 400);
};
module.exports = (err, req, res, next) => {
    console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    let error = Object.assign({}, err);
    if (error.name === "CastError")
        error = handleCastErrorDB(error);
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }
    else {
        console.error("ERROR 💥", error._message);
        res.status(500).json({
            status: "error",
            message: error._message,
        });
    }
};
