
require("dotenv").config();


const app =  require("../backend/src/app")
const connectDb = require("../backend/src/config/db")

connectDb();

app.listen(3000,()=>{
    console.log("server is running  in 3000 port")
})