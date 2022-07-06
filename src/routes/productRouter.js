import { Router } from "express";
import { addItem, getItems } from "../controllers/productControllers.js";
import { findDuplicate } from "../middlewares/findDuplicate.js";

const productRouter = Router();

productRouter.post('/products', findDuplicate, addItem);
productRouter.get('/products', getItems);

export default productRouter;