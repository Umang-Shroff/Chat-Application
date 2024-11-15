const express = require('express');

// DB Connection
require('./db/connection')

// Import Files
const Users = require('./models/Users')

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json())
app.use(express.urlencoded({extended: false}))
// app.use(cors())

app.listen(PORT, (req,res)=>{
    console.log(`Listening on port ${PORT}`)
})