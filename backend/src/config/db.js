const mongoose =  require("mongoose");

const connectDb = async()=>{
    try{
   await  mongoose.connect(process.env.MONGO_URI)
   .then(()=>{
    console.log("db is connected properly")
   })}
   catch(error){
    console.log(" server is not connected successfully")
   }
}

module.exports = connectDb