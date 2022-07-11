import { Router } from "express";
import { clearData } from "../middlewares/stripMiddleware.js";
import { authenticateToken } from "../middlewares/tokenMiddleware.js";
import { searchHistory } from "../controllers/historyController.js";
const historyRouter = Router();

historyRouter.get('/history', authenticateToken, searchHistory);


export default historyRouter;