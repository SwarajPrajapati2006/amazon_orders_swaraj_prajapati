require("dotenv").config();

const app =  require("../Backend/src/app")

const connectDB =  require("../Backend/src/config/db")

connectDB();
app.listen(3000,()=>{
    console.log("server is ruunning in 3000 port")
})
