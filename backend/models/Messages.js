const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,  
    },
    senderId: {
        type: String,
        required: true,  
    },
    message: {
        type: String,
        required: true,   
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
}, { timestamps: true });   

const Messages = mongoose.model('Message', messageSchema);

module.exports = Messages;
