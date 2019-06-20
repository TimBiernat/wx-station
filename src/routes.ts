
import { Router } from "express";
import * as controller from "./controller";

const router = Router();

// location/1
router.get("/location/:locationId", (req, res) => controller.location(req, res, "locationId"));

// temperature/1
router.get("/:value/:locationId", (req, res) => controller.get(req, res, "value", "locationId"));

// temperature/1/2019-6-1/2019-6-2
router.get("/:value/:locationId/:start/:end", (req, res) => controller.query(req, res, "value", "locationId", "start", "end"));

//1/2019-6-1/2019-6-2
router.get("/:locationId/:start/:end", (req, res) => controller.queryAll(req, res, "locationId", "start", "end"));

export default router;
