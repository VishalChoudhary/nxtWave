const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    companyName: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: 18,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    profileImage: {
        type: String,
        required: true,
    },
    otp: {
        code: {
            type: String,
            default: null,
        },
        expiresAt: {
            type: Date,
            default: null,
        }
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;