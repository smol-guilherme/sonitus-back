import { Router } from "express";
import { addItem } from "../controllers/productControllers.js";
import { findDuplicate } from "../middlewares/findDuplicate.js";

const productRouter = Router();

productRouter.post('/products', findDuplicate, addItem);

export default productRouter;