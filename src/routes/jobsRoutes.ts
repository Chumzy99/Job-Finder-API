import express from "express";
const router = express.Router();
import authController from "../controllers/authController";
import jobsController from "../controllers/jobsController";

router
  .route("/")
  .post(jobsController.createJob)
  .get(authController.authProtect, jobsController.getAllJobs);

// This gets all jobs, regardless of who is logged in, regardless of the role.
router.route("/all").get(jobsController.getEveryJob);

router
  .route("/:id")
  .get(jobsController.getJob)
  .patch(jobsController.updateJob)
  .delete(jobsController.deleteJob);

export default router;
