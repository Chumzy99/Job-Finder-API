"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const JobSchema = new mongoose_1.default.Schema({
    position: {
        type: String,
        required: [true, "Please specify position"],
        maxlength: 50,
    },
    company: {
        type: String,
        required: [true, "Please provide company name"],
    },
    location: {
        type: String,
        required: [true, "Please provide job location"],
    },
    languageCategory: {
        type: String,
        required: [true, "Please provide job category"],
    },
    howToApply: {
        type: String,
        required: [true, "Please provide how to apply"],
    },
    companyUrl: {
        type: String,
        required: [true, "Please provide job url"],
    },
    description: {
        type: String,
        required: [true, "Please provide job description"],
        trim: true,
    },
    status: {
        type: String,
        enum: ["interview", "declined", "pending"],
        default: "pending",
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Job", JobSchema);
