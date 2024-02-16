import express from "express";
import { getWallet,putBalance } from "../controllers/wallet.js";

const router = express.Router();


router.get('/:wallet_id', getWallet)
router.put('/:wallet_id', putBalance)


export default router;