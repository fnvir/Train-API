import express from "express";
import { createStation,getAllStations, getStation } from "../controllers/station.js";

const router = express.Router();


router.post('/', createStation)
router.get('/', getAllStations)
router.get('/:station_id/trains', getStation)

// router.put('/:id', updateBook)

// router.get('/:id', fetchBook)
// router.get('/', fetchAll)

export default router;