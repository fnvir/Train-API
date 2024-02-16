import mongoose from "mongoose";


const trainSchema = new mongoose.Schema({
    train_id: {
        type: Number,
        required: true
    },
    train_name: String,
    capacity: {
        type: Number,
        required: true
    },
    stops: [{
        station_id: {
            type: Number,
            required: true
        },
        arrival_time: String,
        departure_time: String,
        fare: Number
    }]
});

const Train = mongoose.model('Train', trainSchema);

export default Train;
