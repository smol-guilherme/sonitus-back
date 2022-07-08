import { Router } from "express";
import { addItem, getItems } from "../controllers/productControllers.js";
import { findDuplicate } from "../middlewares/findDuplicate.js";
import { clearData } from "../middlewares/stripQueryMiddleware.js"

const productRouter = Router();

productRouter.post('/products', findDuplicate, addItem);
productRouter.get('/products', clearData,  getItems);
//productRouter.put('/products', editItem)
export default productRouter;