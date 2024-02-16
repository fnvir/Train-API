import mongoose from "mongoose";


const stationSchema = new mongoose.Schema({
    station_id: {
        type: Number,
        required: true,
        unique: true
    },
    station_name: String,
    longitude: {
        type: Number,
    },
    latitude: {
        type: Number,
    }
});


const Station=mongoose.model('Station',stationSchema);

export default Station;