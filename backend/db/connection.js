const mongoose = require('mongoose');
require('dotenv').config();

const username = process.env.USERISHERE
const password = process.env.PASSWORD

console.log("username: ",password)

const url = `mongodb+srv://${username}:${password}@cluster0.hnumv7z.mongodb.net/ChatApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(url,{
    // useNewUrlParse: true,
    useUnifiedTopology: true
}).then(()=> console.log("Connected to DB")).catch((e)=>console.log("Error: ",e))
