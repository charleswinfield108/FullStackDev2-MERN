import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  session_token: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // TTL index: automatically delete documents 24 hours after creation
    expires: 86400, // 24 hours in seconds
  },
});

export default mongoose.model('Session', sessionSchema, 'Sessions');
