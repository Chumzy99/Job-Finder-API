import express from "express";
const router = express.Router();
import authController from "../controllers/authController";
import jobsController from "../controllers/jobsController";

router
  .route("/")
  .post(jobsController.createJob)
  .get(authController.authProtect, jobsController.getAllJobs);

router.route("/all").get(jobsController.getEveryJob);

router
  .route("/:id")
  .get(jobsController.getJob)
  .patch(jobsController.updateJob)
  .delete(jobsController.deleteJob);

export default router;
