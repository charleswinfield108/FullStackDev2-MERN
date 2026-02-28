import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  fees: {
    type: Number,
    required: true,
  },
  sales: {
    type: Number,
    required: true,
  },
});

export default mongoose.model('Agent', agentSchema, 'agents');
