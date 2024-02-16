import mongoose from "mongoose";


const userSchema=new mongoose.Schema(
    {
        user_id:{
            type: Number,
            required: true,
        },
        user_name: String,
        balance: Number
    }
)


const User=mongoose.model('User',userSchema);

export default User;