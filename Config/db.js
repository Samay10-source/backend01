import mongoose from "mongoose";

export const  connectDB = async () =>{

    await mongoose.connect('mongodb+srv://sanchitgoswami46:Luffy1234@cluster0.m0tihix.mongodb.net/Project-internship').then(()=>console.log("DB Connected"));
   
}


