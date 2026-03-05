import express from 'express';
import Transaction from '../models/Transaction.js';
import Agent from '../models/Agent.js';

const router = express.Router();

// GET report data for charts
router.get('/report-data', async (req, res) => {
  try {
    // Get all transactions with agent details
    const transactions = await Transaction.find().populate('agent_id');

    // ===== BAR CHART DATA: Total transaction amount per agent =====
    const agentTotals = {};
    transactions.forEach((transaction) => {
      const agentName = transaction.agent_id
        ? `${transaction.agent_id.first_name} ${transaction.agent_id.last_name}`
        : 'Inactive Agent';
      
      if (!agentTotals[agentName]) {
        agentTotals[agentName] = 0;
      }
      agentTotals[agentName] += transaction.amount;
    });

    const agent_bar_data = {
      labels: Object.keys(agentTotals),
      datasets: [
        {
          label: 'Total Transaction Amount',
          data: Object.values(agentTotals),
          backgroundColor: [
            'rgba(75, 192, 192, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 99, 132, 0.8)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    // ===== LINE CHART DATA: Daily transaction totals for past 2 weeks =====
    // Calculate dates for the past 14 days
    const dailyTotals = {};
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      dailyTotals[dateKey] = 0;
    }

    // Sum transactions by date
    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString().split('T')[0];
      
      // Only include transactions within the past 14 days
      if (dailyTotals.hasOwnProperty(dateKey)) {
        dailyTotals[dateKey] += transaction.amount;
      }
    });

    const transaction_line_data = {
      labels: Object.keys(dailyTotals),
      datasets: [
        {
          label: 'Daily Transaction Totals',
          data: Object.values(dailyTotals),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
      ],
    };

    res.status(200).json({
      status: 'ok',
      data: {
        agent_bar_data,
        transaction_line_data,
      },
      message: null,
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
