const mongoose = require('mongoose');

const url = "mongodb+srv://iLambor55:123456789101112@cluster0.hnumv7z.mongodb.net/ChatApp?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(url,{
    // useNewUrlParse: true,
    useUnifiedTopology: true
}).then(()=> console.log("Connected to DB")).catch((e)=>console.log("Error: ",e))
