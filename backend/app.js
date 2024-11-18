const express = require('express');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const io = require('socket.io')(8080,{
    cors: {
        origin: ['https://chat-application-seven-eosin.vercel.app','http://localhost:3000']
    }
})

// const port = 'https://chat-application-3jzb.onrender.com';

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
    origin: ['https://chat-application-seven-eosin.vercel.app','http://localhost:3000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));

// SOCKET.IO
let users = [];       

io.on('connection', socket => {
    console.log('User Connected ', socket.id);
 
    const userId = socket.handshake.query.userId;
 
    socket.on('addUser', userId => { 
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) { 
            const user = { userId, socketId: socket.id };
            users.push(user); 
 
            io.emit('getUsers', users);
            console.log("Users currently Online: ",users) 
        }
    });

    socket.on('typing', ({ userId, conversationId }) => { 
        socket.broadcast.emit('typingReceieve', { userId, conversationId }); 
    });
 
    socket.on('sendMessage', async ({ conversationId, senderId, message, receiverId }) => { 
        const receiver = users.find(user => user.userId === receiverId);
        const sender = users.find(user => user.userId === senderId);
 
        const user = await Users.findById(senderId);

        if (receiver && sender) { 
            const newMessage = new Messages({
                conversationId,
                senderId,
                message
            });

            await newMessage.save();
 
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                user: { id: user._id, name: user.name, email: user.email },
                timestamp: newMessage.createdAt
            });
        }
    });
 
    socket.on('disconnect', () => {
        const userIndex = users.findIndex(user => user.socketId === socket.id);
        if (userIndex !== -1) {
            const userId = users[userIndex].userId;
 
            users.splice(userIndex, 1);
 
            io.emit('getUsers', users);

            console.log('User disconnected: ', socket.id);
        }
    });
});



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
            // console.log("id: ",user.id,"Email: ",user.email," name: ",user.name, "ConversationID: ",conversation._id)
            return { user:{id:user.id, email: user.email, name:user.name},conversationId: conversation._id }
        }))
        res.status(200).json(await conversationUserData);
    } catch (error) {
        console.log("Error: ",error)
    }
})


app.post('/api/message', async (req, res) => {
    try {
        const { conversationId, senderId, message, receiverId } = req.body;
        console.log({ conversationId, senderId, message, receiverId });

        // Check for missing fields
        if (!senderId || !message) {
            console.log("!sender || !msg");
            return res.status(400).send("Please fill all fields");
        }

        // If it's a new conversation and receiverId is provided
        if (conversationId === 'new' && receiverId) {
            console.log("!conversationId && receiverId");

            // Check if the conversation between senderId and receiverId already exists
            const existingConversation = await Conversations.findOne({
                members: { $all: [senderId, receiverId] }
            });

            if (existingConversation) {
                console.log("senderId and receiverId in database repeated");
                // const newMessage = new Messages({ conversationId, senderId, message });
                // await newMessage.save();
                // res.status(200).send("Message sent successfully");
                // return res.status(400).send("Conversation already exists between these users");
            }else{
                // If no existing conversation
                const newConversation = new Conversations({
                    members: [senderId, receiverId]
                });
                await newConversation.save();
    
                const newMessage = new Messages({
                    conversationId: newConversation._id,
                    senderId,
                    message
                });
                await newMessage.save();
            }
            return res.status(200).send("Message sent successfully");
        } else if (!conversationId && !receiverId) {
            return res.status(400).send("Please fill all fields");
        }
        const newMessage = new Messages({
            conversationId,
            senderId,
            message
        });
        await newMessage.save();
        res.status(200).send("Message sent successfully");

    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send("Internal Server Error");
    }
});


// app.post('/api/message',async (req,res) => {
//     try {
//         const { conversationId, senderId, message, receiverId } = req.body;
//         console.log({conversationId, senderId, message, receiverId})
//         if(!senderId || !message){ console.log("!sender || !msg"); return res.status(400).send("Please fill all fields")}
//         if(conversationId==='new' && receiverId){
//             console.log("!conversationId && receiverId");

//             const newConversation = new Conversations({ members:[senderId, receiverId] });
//             await newConversation.save();
//             const newMessage = new Messages({ conversationId: newConversation._id, senderId, message});
//             await newMessage.save();
//             return res.status(200).send("Message sent successfully")
//         }
//         else if(!conversationId && !receiverId){
//             return res.status(400).send("Please fill all fields");
//         }
//         const newMessage = new Messages({ conversationId, senderId, message });
//         await newMessage.save();
//         res.status(200).send("Message sent successfully");
//     } catch (error) {
//         console.log("Error: ",error)
//     }
// })

app.get('/api/message/:conversationId', async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        if (conversationId === 'new') {
            return res.status(200).json([]);
        }

        const messages = await Messages.find({ conversationId });

        const messageUserData = await Promise.all(messages.map(async (message) => {
            const user = await Users.findById(message.senderId);
            return {
                user: { id: user._id, email: user.email, name: user.name },
                message: message.message,
                timestamp: message.createdAt // Return the timestamp along with the message
            };
        }));

        res.status(200).json(messageUserData);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send("Internal Server Error");
    }
});


app.get('/api/trial/:conversationId', async(req,res) => {
    try {
        const conversationId = req.params.conversationId;
        console.log("Convo Id: ",conversationId)
        if(conversationId === 'new') {return res.status(200).json([]);}
        const messages = await Messages.find({ conversationId });
        console.log({messages})
    } catch (error) {
        console.log("Eror: ",error)
    }
})

app.get('/api/users', async (req,res) => {
    try {
        const users = await Users.find();
        const usersData = Promise.all(users.map(async (user) => {
            return { user: { email: user.email, name: user.name, receiverId: user._id } }
        }))
        res.status(200).json(await usersData);
    } catch (error) {
        console.log("Error: ",error)
    }
})

app.listen(PORT, (req,res)=>{
    console.log(`Listening on port ${PORT}`)
})