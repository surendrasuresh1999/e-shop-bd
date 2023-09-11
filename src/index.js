const express = require('express');
const cors = require("cors");
const app = express();

app.use(express.json())
app.use(cors())


app.get('/',(req,res)=>{
    return res.status(200).send({message:"hello welcome to backend"})
})

const authRoutes = require("./routes/auth.route.js");
app.use("/auth",authRoutes);

const userRoutes = require("./routes/user.route.js");
app.use("/api/users",userRoutes)

module.exports = app;