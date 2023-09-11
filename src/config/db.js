const mongoose = require("mongoose");

const mongoDbUrl="mongodb+srv://ksurendraparla1999:jbD6KtNZSc1QEcJN@cluster0.ogm7h3h.mongodb.net/?retryWrites=true&w=majority";

const connectDb = () =>{
    return mongoose.connect(mongoDbUrl)
}

module.exports = {connectDb}