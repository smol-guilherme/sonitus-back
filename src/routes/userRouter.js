import { Router } from "express";
import { clearData } from "../middlewares/stripMiddleware.js";
import { userValidation } from "../middlewares/joiMiddleware.js";
import { signIn, signUp } from "../controllers/userController.js";
const router = Router();

router.post("/signup", clearData, userValidation, signUp);
router.post("/signin", clearData, userValidation, signIn);

export default router;