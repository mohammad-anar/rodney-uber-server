import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { AnalyticsController } from "./analytics.controller";

const router = express.Router();


router.get("/", auth(USER_ROLES.ADMIN), AnalyticsController.getDashboardAnalytics)

export const AnalyticsRouter = router;