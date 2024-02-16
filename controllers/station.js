import Station from "../models/station.js";
import Train from "../models/train.js";

export const createStation = async (req, res) => {
    try {
        const { station_id, station_name, longitude, latitude } = req.body;
        let st=await Station.findOne({station_id})
        if(st){
            st.station_name=station_name
            st.longitude=longitude
            st.latitude=latitude
            await st.save()
            res.status(201).json(st)
        }
        const newStation = new Station({
            station_id, station_name, longitude, latitude
        })
        const station = await newStation.save()
        res.status(201).json(station)
    } catch (err) {
        console.error('Err at createStation: ')
        res.status(500).json({ message: err.message })
    }
}

export const getStation = async (req, res) => {
    try {
        let { station_id } = req.params;
        if (!Station.findOne({ station_id }))
            return res.status(404).json({ message: `station with id: ${station_id} was not found` })
        let trains = await Train.find({ stops: { $elemMatch: { station_id } } }).select('-__v -_id').lean()
        trains=trains.map(t=>{
            const st=t.stops.find(s=>s.station_id==station_id)
            return {train_id:t.train_id,arrival_time:st?.arrival_time,departure_time:st?.departure_time}
        })
        res.status(200).json({ station_id:parseInt(station_id), trains });
    } catch (err) {
        console.error('Err at getStation')
        res.status(500).json({ message: err.message })
    }
}

export const getAllStations = async (req, res) => {
    try {
        const stations = await Station.find().sort({station_id:1}).select('-__v -_id');
        res.status(200).json({ stations })
    } catch (err) {
        console.error('Err at getAllStations')
        res.status(500).json({ message: err.message })
    }
}