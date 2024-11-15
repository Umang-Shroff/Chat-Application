const express = require('express');
const bcryptjs = require('bcryptjs')

// DB CONNECTION
require('./db/connection')

// IMPORT FILES
const Users = require('./models/Users')

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json())
app.use(express.urlencoded({extended: false}))
// app.use(cors())

// ROUTES

app.post('/api/register',async (req,res,next)=>{
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            res.status(400).send("Fill required details")
        }else{
            const alreadyExists = await Users.findOne({ email });
            if(alreadyExists){
                res.status(400).send("User exists")
            }
            else{
                const newUser = new Users({ name, email })
                bcryptjs.hash(password, 10, (err, hashedPass)=>{
                    newUser.set('password', hashedPass);
                    newUser.save();
                    next();
                })
                return res.status(200).send("User registered successfully")
            }
        }
    } catch (error) {
        
    }
})


app.listen(PORT, (req,res)=>{
    console.log(`Listening on port ${PORT}`)
})