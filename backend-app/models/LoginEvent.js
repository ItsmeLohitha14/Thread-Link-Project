import mongoose from 'mongoose';
const loginEventSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // For failed logins, userId may not exist
    },
    email: {
        type: String,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    ipAddress: {
        type: String,
    },
});

const LoginEvent = mongoose.model('LoginEvent', loginEventSchema);
export default LoginEvent;