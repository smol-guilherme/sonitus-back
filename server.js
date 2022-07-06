import express,{ json } from "express";
import cors from "cors";

const app = express();
const PORT_IN_USE = process.env.PORT || 5000;

app.use(cors());
app.use(json());

app.listen(PORT_IN_USE, () => console.log(`Server running from port ${PORT_IN_USE} @${Date().toString()}`));