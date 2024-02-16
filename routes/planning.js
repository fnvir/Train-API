import express from "express";
import { findPath } from "../controllers/planning.js";

const router = express.Router();
router.get('/', findPath)

export default router;