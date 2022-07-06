import express,{ json } from "express";
import cors from "cors";
import router from "./src/routes/router.js";
import productRouter from "./src/routes/productRouter.js"

const app = express();
const PORT_IN_USE = process.env.PORT || 5000;

app.use(cors());
app.use(json());
app.use(router)
app.use(productRouter)

app.listen(PORT_IN_USE, () => console.log(`Server running from port ${PORT_IN_USE} @${Date().toString()}`));