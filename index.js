import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser";
import dotenv from "dotenv"
import userRoutes from "./routes/user.js"
import stationRoutes from "./routes/station.js"
import trainRoutes from "./routes/train.js"
import walletRoutes from "./routes/wallet.js"
import ticketRoutes from "./routes/ticket.js"
import planRoutes from "./routes/planning.js"
import User from "./models/user.js";
import Station from "./models/station.js";
import Train from "./models/train.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app=express();
app.use(express.json())
app.use(bodyParser.json({limit:"25mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"25mb",extended:true}))



app.use('/api/users',userRoutes)
app.use('/api/stations',stationRoutes)
app.use('/api/trains',trainRoutes)
app.use('/api/wallets',walletRoutes)
app.use('/api/tickets',ticketRoutes)
app.use('/api/routes',planRoutes)



mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    // await User.deleteMany()
    // await Station.deleteMany()
    // await Train.deleteMany()
}).then(async () => {
    app.listen(PORT, () => console.log('\n\x1b[36m%s\x1b[0m\n\x1b[35mPORT: %s\x1b[0m', 'SERVER STARTED!', PORT))
}).catch((error) => console.error('\x1b[31m%s\x1b[0m', error))
