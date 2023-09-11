const app = require(".");
const { connectDb } = require("./config/db");

const PORT = 3001;

app.listen(PORT,async (req,res)=>{
    await connectDb()
    .then(()=>{
        console.log("mongodb connected")
    })
    .catch((error)=>{
        console.log(error)
    });
    console.log("server connected")
})
