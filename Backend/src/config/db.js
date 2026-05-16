const mongoose =  require("mongoose");

const connectDB = async()=>{
    try{
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
       console.log("db is connected properly")
    })
}

catch(error){
    console.log("db is not connected")
}}

module.exports= connectDB