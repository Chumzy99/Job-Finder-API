"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const jobsRoutes_1 = __importDefault(require("./routes/jobsRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
// import xss from "xss-clean";
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
app.use(express_1.default.json());
// extra packages
const authController_1 = __importDefault(require("./controllers/authController"));
// Security
// rate limmiter
app.set("trust proxy", 1);
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
// app.use(xss());
// routes
app.use("/api/v1/auth", authRoutes_1.default);
app.use("/api/v1/jobs", authController_1.default.authProtect, jobsRoutes_1.default);
app.use("/api/v1/users", userRoutes_1.default);
app.all("*", (req, res, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorController_1.default);
exports.default = app;
