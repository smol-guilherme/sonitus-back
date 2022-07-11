import express,{ json } from "express";
import cors from "cors";
import router from "./src/routes/router.js";
import productRouter from "./src/routes/productRouter.js";
import userHandler from "./src/routes/userRouter.js";
import checkoutRouter from "./src/routes/checkoutRouter.js";
import historyRouter from "./src/routes/historyRouter.js";
const app = express();
const PORT_IN_USE = process.env.PORT || 5000;

app.use(cors());
app.use(json());

app.use(router);
app.use(productRouter);
app.use(checkoutRouter);
app.use(historyRouter);
app.use("/user", userHandler);


app.listen(PORT_IN_USE, () => console.log(`Server running from port ${PORT_IN_USE} @${Date().toString()}`));