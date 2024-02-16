import express from "express";
import { createUser } from "../controllers/user.js";

const router = express.Router();


router.post('/', createUser)

// router.put('/:id', updateBook)

// router.get('/:id', fetchBook)
// router.get('/', fetchAll)

export default router;