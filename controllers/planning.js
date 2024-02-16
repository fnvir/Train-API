import Train from "../models/train.js";
import PriorityQueue from "../utils.js";
import { makeGraph, reconstructPath } from "./ticket.js";

export const findPath = async (req, res) => {
    try{
        const {from,to,optimize='cost'}=req.query;
        if(!from||!to) return res.status(400).json({message:'from and to are required'});
        const trains=await Train.find().select('-__v -_id -stops._id').lean();
        const path=dijkstra2(makeGraph(trains),from,to,optimize);
        if(path.found) {
            res.status(200).json({
                total_cost:path.cost,
                total_time:path.totalTime,
                stations:path.path
            })
        } else {
            res.status(403).json({message:`no routes available from station: ${from} to station: ${to}`})
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const dijkstra2 = (graph,from,to,optimize) => {
    const defaultDict=x=>new Proxy({},{
        get:(target,prop)=>target[prop]??x,
    });
    const toTime=t=>t.split(':').reduce((a,c)=>(60*a+ +c),0);
    const distance=defaultDict(Infinity);
    const prev={[from]:-1};
    const q=new PriorityQueue((a,b)=>a[0]<b[0]);
    q.push([0,{station_id:from}]) // cost , station_id
    while(!q.isEmpty()){
        const a=q.pop(),at=a[1].station_id;
        if(distance[at]<a[0]) continue;
        if(at==to) {
            const path=reconstructPath(from,a[1],prev);
            const totalTime=toTime(path[path.length-1].arrival_time)-toTime(path[0].departure_time);
            const cost=optimize==='cost'?distance[at]:path.reduce((a,c)=>a+(c.fare??0),0);
            return {found:true,cost,totalTime,path};
        }
        for(let b of graph[at]){
            const time=toTime(b.starting_time)+(b.starting_time<a[1].arrival_time?24*60:0);
            const newCost=optimize==='cost'?a[0]+b.fare:time;
            if(newCost<distance[b.station_id]){
                distance[b.station_id]=newCost;
                prev[b.station_id]=a[1];
                q.push([newCost,b]);
            }
        }
    }
    return {found:false}
}
