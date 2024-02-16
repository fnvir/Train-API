import Train from "../models/train.js";
import Station from "../models/station.js";


export const createTrain=async(req,res)=>{
    try{
        const {train_id,train_name,capacity,stops}=req.body;
        let start,end,totalstations=stops?stops.length:0;
        for(let stop of stops){
            let station=await Station.findOne({station_id:stop.station_id});
            if(!station)
                station=await new Station({station_id:stop.station_id}).save()
            if(stop.arrival_time==null && start==null) start=stop['departure_time'];
            if(stop.departure_time==null && end==null) end=stop['arrival_time'];
        }
        const newTrain=new Train({train_id,train_name,capacity,stops})
        let train=await newTrain.save()
        train=train.toObject()
        delete train.stops;
        train["service_start"]=start;
        train["service_end"]=end;
        train['num_stations']=totalstations;
        res.status(201).json(train)
    } catch(err){
        console.error('Err at train/createTrain')
        res.status(500).json({message:err.message})
    }
}


export const getTrains=async(req,res)=>{
    try{
        const trains=await Train.find().select('-__v -_id -stops._id');
        res.status(201).json(trains)
    } catch(err){
        console.error('Err at train/createTrain')
        res.status(500).json({message:err.message})
    }
}