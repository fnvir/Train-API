import express from "express";
import { purchase } from "../controllers/ticket.js";

const router = express.Router();


router.post('/', purchase)

// router.put('/:id', updateBook)

// router.get('/:id', fetchBook)
// router.get('/', fetchAll)

export default router;