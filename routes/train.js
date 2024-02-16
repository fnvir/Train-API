import express from "express";
import { createTrain, getTrains } from "../controllers/train.js";

const router = express.Router();


router.post('/', createTrain)
router.get('/',getTrains)


export default router;