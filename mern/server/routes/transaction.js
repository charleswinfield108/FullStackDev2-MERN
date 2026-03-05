import express from 'express';
import Transaction from '../models/Transaction.js';
import Agent from '../models/Agent.js';

const router = express.Router();

// GET transaction data - fetch transactions with pagination
router.get('/transaction-data', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // Get total count for pagination
    const totalTransactions = await Transaction.countDocuments();

    // Fetch paginated transactions
    const transactions = await Transaction.find()
      .populate('agent_id', 'first_name last_name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalPages = Math.ceil(totalTransactions / pageSize);

    res.status(200).json({
      status: 'ok',
      data: transactions,
      totalTransactions,
      totalPages,
      currentPage: page,
      message: 'Transactions retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      message: error.message,
    });
  }
});

// POST - create a new transaction
router.post('/', async (req, res) => {
  try {
    const { amount, agent_id } = req.body;

    // Validate input
    if (!amount || !agent_id) {
      return res.status(400).json({
        status: 'error',
        data: null,
        message: 'Amount and agent_id are required',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        status: 'error',
        data: null,
        message: 'Amount must be a positive number',
      });
    }

    // Verify agent exists
    const agent = await Agent.findById(agent_id);
    if (!agent) {
      return res.status(404).json({
        status: 'error',
        data: null,
        message: 'Agent not found',
      });
    }

    // Create transaction
    const transaction = new Transaction({
      amount,
      agent_id,
    });

    await transaction.save();

    // Update agent's sales by adding the transaction amount
    const updatedAgent = await Agent.findByIdAndUpdate(
      agent_id,
      { $inc: { sales: amount } },
      { returnDocument: 'after' }
    );

    res.status(201).json({
      status: 'ok',
      data: transaction,
      message: 'Transaction created successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      message: error.message,
    });
  }
});

export default router;
