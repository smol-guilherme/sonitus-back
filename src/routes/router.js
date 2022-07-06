import { Router } from "express";

const router = Router();

router.get('/', (req, res) => res.status(200).send("Welcome to the best vinyl store in the world"));
router.get('/health', (req, res) => res.status(200).send("OK"));