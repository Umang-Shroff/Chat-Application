const express = require('express');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const io = require('socket.io')(8080,{
    cors: {
        origin: 'https://chat-application-d6toix5oy-umang-shroffs-projects.vercel.app',
    }
})

const port = 'https://chat-application-3jzb.onrender.com';

// DB CONNECTION
require('./db/connection')

// IMPORT FILES
const Users = require('./models/Users')
const Conversations = require('./models/Conversation');
const Messages = require('./models/Messages');

const app = express();
const PORT = port || 8000;

app.use(express.json())
app.use(express.urlencoded({extended: false}))

const corsOptions = {
    origin: 'https://chat-application-d6toix5oy-umang-shroffs-projects.vercel.app', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));

// SOCKET.IO
let users = [];          // Array to track connected users
let userStatus = {};     // Object to track users' online/offline status

io.on('connection', socket => {
    console.log('User Connected ', socket.id);

    // Get the userId from the socket handshake query
    const userId = socket.handshake.query.userId;

    // Initially set the user status to 'online'
    userStatus[userId] = 'online';

    // Emit the updated status of all users to all connected clients
    io.emit('updateUserStatus', userStatus);

    // Add user to the online status tracker
    socket.on('addUser', userId => {
        // Check if the user is already in the 'users' array
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            // Add user to the users array
            const user = { userId, socketId: socket.id };
            users.push(user);
            userStatus[userId] = 'online'; // Set user as online

            // Emit the updated user list and status to all clients
            io.emit('getUsers', users);
            io.emit('updateUserStatus', userStatus);
        }
    });

    // Listen for messages from users
    socket.on('sendMessage', async ({ conversationId, senderId, message, receiverId }) => {
        // Find the sender and receiver users in the 'users' array
        const receiver = users.find(user => user.userId === receiverId);
        const sender = users.find(user => user.userId === senderId);

        // Ensure the sender exists
        const user = await Users.findById(senderId);

        if (receiver && sender) {
            // Create a new message and save it to the database
            const newMessage = new Messages({
                conversationId,
                senderId,
                message
            });

            await newMessage.save();

            // Emit the message with timestamp to both sender and receiver
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

    // Handle user disconnection
    socket.on('disconnect', () => {
        const userIndex = users.findIndex(user => user.socketId === socket.id);
        if (userIndex !== -1) {
            const userId = users[userIndex].userId;

            // Remove the user from the 'users' array
            users.splice(userIndex, 1);

            // Set the user's status to 'offline'
            userStatus[userId] = 'offline';

            // Emit the updated user status and list to all clients
            io.emit('updateUserStatus', userStatus);
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