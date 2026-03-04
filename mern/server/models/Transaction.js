import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0.01, // Ensure positive numbers only
  },
  agent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for sorting by date (most recent first)
transactionSchema.index({ createdAt: -1 });

export default mongoose.model('Transaction', transactionSchema);
