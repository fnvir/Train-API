import Train from "../models/train.js";
import User from "../models/user.js";
import PriorityQueue from "../utils.js";

export const purchase = async (req, res) => {
    try{
        const {wallet_id, time_after,station_from,station_to}=req.body;
        let user = await User.findOne({user_id:+wallet_id});
        const trains=await Train.find().select('-__v -_id -stops._id').lean();
        const path=dijkstra3(makeGraph(trains),station_from,station_to,time_after);
        if(path.found){
            if(path.cost>user.balance)
                return res.status(402).json({message:`recharge amount: ${path.cost-user.balance} to purchase the ticket`})
            user.balance-=path.cost;
            user=await user.save();
            res.status(201).json({
                ticket_id:(Date.now()%(10**9)),
                wallet_id:user.user_id,
                balance:user.balance,
                stations:path.path
            })
        } else {
            res.status(403).json({message:`no ticket available for station: ${station_from} to station: ${station_to}`})
        }
    } catch (error) {
        console.error('Err at ticket/purchase');
        res.status(500).json({ error: 'Internal server error' });
    }
};


export function makeGraph(trains){
    const m={};
    for(let train of trains){
        const stations=train.stops,n=stations.length;
        for(let i=1;i<n;i++){
            stations[i].train_id=train.train_id;
            stations[i].starting_time=stations[i-1].departure_time;
            m[stations[i-1].station_id]=m[stations[i-1].station_id]??Array();
            m[stations[i-1].station_id].push(stations[i]);
        }
        if(n>0)
            m[stations[n-1].station_id]=m[stations[n-1].station_id]??Array();
    }
    return m;
}

const dijkstra3 = (graph,from,to,after) => {
    /**
     * select cheapest cost node first but store least time to reach each node
     * revisit node if more early arrival time is found
     */
    const defaultDict=x=>new Proxy({},{
        get:(target,prop)=>target[prop]??x,
    });
    const toTime=t=>t.split(':').reduce((a,c)=>(60*a+ +c),0);
    const leastTime=defaultDict(Infinity);
    const prev={[from]:-1};
    const q=new PriorityQueue((a,b)=>a[0]<b[0]);
    q.push([0,{station_id:from,arrival_time:after},-1]) // fare , station
    while(!q.isEmpty()){
        const a=q.pop(),at=a[1].station_id,arrA=toTime(a[1].arrival_time);
        if(leastTime[at]<arrA) continue;
        leastTime[at]=arrA;
        prev[at]=a[2];
        if(at==to) {
            return {found:true,cost:a[0],path:reconstructPath(from,a[1],prev)};
        }
        if(!graph[at]) continue;
        for(let b of graph[at]){
            let start_AtoB=toTime(b.starting_time);
            if(start_AtoB<arrA) continue;
            const newCost=a[0]+b.fare;
            if(start_AtoB<leastTime[b.station_id])
                q.push([newCost,b,a[1]]);
        }
    }
    return {found:false}
}

function dijkstra(alist,from,to,after){
    /**
     * Modified multi-objective dijkstra's algorithm on multigraph 
     * which finds minimum cost path by selecting the fastest arriving trains first
     * Generates all paths from source to destination sorted by cost in descending order
    */
    const toDate=x=>new Date('2024 1 1 '+x);
    const defaultDict=x=>new Proxy({},{
        get:(target,prop)=>target[prop]??x,
    });
    const dis=defaultDict(Infinity);
    const prev={};
    const paths=[];
    const q=new PriorityQueue();
    dis[from]=0;
    q.push([after,0,{station_id:from},-1]); // [arrival_time_at_curr_station, distance, current_station, prev_station]
    while(!q.isEmpty()){
        let a=q.pop(),at=a[2].station_id;
        if(a[1]>dis[at]) continue;
        prev[at]=a[3]
        dis[at]=a[1]
        if(at==to) {
            paths.push({cost:a[1],path:reconstructPath(from,a[2],prev)});
            continue // to find other paths with cheaper cost
        }
        const arrivalA=toDate(a[0]);
        for(let b of alist[at]){
            if(toDate(b.starting_time)<arrivalA) continue;
            let new_dis=dis[at]+b.fare;
            if(new_dis<dis[b.station_id])
                q.push([b.arrival_time,new_dis,b,a[2]]);
        }
    }
    return paths;
}

export function reconstructPath(from,to,prev){
    let path=[];
    for(let at=to;at.station_id!=from;at=prev[at.station_id])
        path.push({...at});
    let last=path[path.length-1];
    path.push({station_id:+from,train_id:last.train_id,arrival_time:null,departure_time:last.starting_time,fare:0})
    path[0].departure_time=null;
    return path.reverse();
}