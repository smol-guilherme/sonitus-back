import { Router } from "express";
import { clearData } from "../middlewares/stripMiddleware";
const router = Router();

router.post("/signup", clearData)
router.post("/signin", clearData)

export default router;