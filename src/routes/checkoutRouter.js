import { Router } from "express";
import { clearData } from "../middlewares/stripMiddleware.js";
import { userValidation } from "../middlewares/joiMiddleware.js";
import { checkoutHandlers } from "../controllers/checkoutControllers.js";

const checkoutRouter = Router();

checkoutRouter.use(clearData);
checkoutRouter.use(userValidation);
checkoutRouter.post('/checkout', checkoutHandlers);

export default checkoutRouter;