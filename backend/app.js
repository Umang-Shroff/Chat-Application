const express = require('express');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')

// DB CONNECTION
require('./db/connection')

// IMPORT FILES
const Users = require('./models/Users')
const Conversations = require('./models/Conversation');
const Messages = require('./models/Messages');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json())
app.use(express.urlencoded({extended: false}))

const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));

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
        return res.status(400).json({ "error": error})
    }
})

app.post('/api/login', async (req,res,next)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            res.status(400).send("Fill all details")
        }else{
            const user = await Users.findOne({ email })
            if(!user){
                res.status(400).send("User not found")
            }else{
                const checkPass = await bcryptjs.compare(password, user.password)
                if(!checkPass){
                    res.status(400).send("Username or Passsword is incorrect")
                }else{
                    const payload = {
                        userId: user._id,
                        email: user.email
                    }
                    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "JWT_SECRET_KEY_IS_HERE"
                    jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
                        await Users.updateOne({ _id: user._id }, { $set : {token} })
                        user.save();
                        // console.log("token setting error",err)
                        next()
                    })
                    res.status(200).json({ user:{ id: user._id, email: user.email, name:user.name}, token: user.token })
                }
            }
        }
    } catch (error) {
        return res.status(400).json({ "error": error})
    }
})

app.post('/api/conversations', async (req,res,next) => {
    try {
        const {senderId, receiverId} = req.body;
        const newConversation = new Conversations({ members: [senderId, receiverId] })
        await newConversation.save();
        res.status(200).send("Conversation created successfully")
    } catch (error) {
        return res.status(400).json({ "Error": error })
    }
})

app.get('/api/conversations/:userId', async (req,res) => {
    try {
        const userId = req.params.userId;
        const conversations = await Conversations.find({ members: { $in: [userId] } })
        const conversationUserData = Promise.all(conversations.map(async(conversation)=>{
            const receiverId =conversation.members.find((member)=> member !== userId);
            const user = await Users.findById(receiverId);
            return { user:{ email: user.email, name:user.name},conversationId: conversation._id }
        }))
        res.status(200).json(await conversationUserData);
    } catch (error) {
        console.log("Error: ",error)
    }
})

app.post('/api/message',async (req,res) => {
    try {
        const { conversationId, senderId, message } = req.body;
        const newMessage = new Messages({ conversationId, senderId, message });
        await newMessage.save();
        res.status(200).send("Message sent successfully");
    } catch (error) {
        console.log("Error: ",error)
    }
})

app.get('/api/message/:conversationId', async(req,res)=>{
    try {
        const conversationId = req.params.conversationId;
        if(conversationId === 'new') return res.status(200).json([]);
        const messages = await Messages.find({ conversationId });
        const messageUserData = Promise.all(messages.map(async (message) => {
            const user = await Users.findById(message.senderId);
            return { user: { email: user.email, name: user.name }, message: message.message }
        }))
        res.status(200).json(await messageUserData)
    } catch (error) {
        console.log("Error: ",error)
    }
})

app.get('/api/users', async (req,res) => {
    try {
        const users = await Users.find();
        const usersData = Promise.all(users.map(async (user) => {
            return { user: { email: user.email, name: user.name }, userId: user._id }
        }))
        res.status(200).json(await usersData);
    } catch (error) {
        console.log("Error: ",error)
    }
})

app.post('/api/message', async(req,res)=>{
    try {
        const { conversationId, senderId, message, receiverId = ''} = req.body;
        if(!senderId || !message) return res.status(400).send("Please fill all required fields")
        if(!conversationId && receiverId){
            const newConversation = new Conversations({ members: [senderId, receiverId] });
            await newConversation.save();
            const newMessage = new Messages({ conversationId: newConversation._id, senderId, message });
            await newMessage.save();
            return res.status(200).send("Message sent successfully")
        }else if(!conversationId && !receiverId){
            return res.status(200).send("Please fill all required fields")
        }
        const newMessage = new Messages({ conversationId, senderId, message });
        await newMessage.save();
        res.status(200).send("Message sent successfully")
    } catch (error) {
        
    }
})

app.listen(PORT, (req,res)=>{
    console.log(`Listening on port ${PORT}`)
})