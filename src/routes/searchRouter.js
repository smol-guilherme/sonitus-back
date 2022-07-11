import { Router } from "express";
import { clearData } from "../middlewares/stripQueryMiddleware.js";
import { querySearch } from "../controllers/searchControllers.js";

const searchRouter = Router();

searchRouter.get("/search", clearData, querySearch)

export default searchRouter;