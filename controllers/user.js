import User from "../models/user.js";

export const createUser=async(req,res)=>{
    try{
        const {user_id,user_name,balance}=req.body;
        const newUser=new User({
            user_id,user_name,balance
        })
        const user=await newUser.save()
        res.status(201).json(user)
    } catch(err){
        console.error('Err at user/createUser')
        res.status(500).json({message:err.message})
    }
}