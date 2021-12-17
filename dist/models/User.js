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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose_1.default.Schema({
    fullname: {
        type: String,
        required: [true, "Please provide name"],
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        lowercase: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ],
        unique: true,
    },
    role: {
        type: String,
        enum: ["job-seeker", "employer"],
        required: [true, "Please provide a user role"],
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: 6,
        trim: true,
    },
});
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcryptjs_1.default.genSalt(12);
        this.password = yield bcryptjs_1.default.hash(this.password, salt);
    });
});
// UserSchema.methods.getName = function <IUser>() {
//   return this.fullname;
// };
UserSchema.methods.createJWT = function () {
    return jwt.sign({
        userId: this._id,
        fullname: this.fullname,
        role: this.role,
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};
UserSchema.methods.comparePassword = function (incomingPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = yield bcryptjs_1.default.compare(incomingPassword, this.password);
        return isMatch;
    });
};
exports.default = mongoose_1.default.model("User", UserSchema);
