const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    imageURL:{
        type: String,
    },
    token:{
        type: String,
    }
})

const Users = mongoose.model('Users', userSchema)

module.exports = Users;