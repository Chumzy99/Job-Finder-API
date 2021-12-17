"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authController_1 = __importDefault(require("../controllers/authController"));
const jobsController_1 = __importDefault(require("../controllers/jobsController"));
router
    .route("/")
    .post(jobsController_1.default.createJob)
    .get(authController_1.default.authProtect, jobsController_1.default.getAllJobs);
router.route("/all").get(jobsController_1.default.getEveryJob);
router
    .route("/:id")
    .get(jobsController_1.default.getJob)
    .patch(jobsController_1.default.updateJob)
    .delete(jobsController_1.default.deleteJob);
exports.default = router;
