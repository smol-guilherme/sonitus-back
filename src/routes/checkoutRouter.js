import { Router } from "express";
import { clearData } from "../middlewares/stripMiddleware.js";
import { userValidation } from "../middlewares/joiMiddleware.js";
import { checkoutHandlers } from "../controllers/checkoutControllers.js";
import { authenticateToken } from "../middlewares/tokenMiddleware.js";
const checkoutRouter = Router();

checkoutRouter.post('/checkout', clearData, userValidation,  authenticateToken, checkoutHandlers);

export default checkoutRouter;