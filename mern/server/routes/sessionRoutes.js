import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Session from '../models/Session.js';
import User from '../models/User.js';

const router = express.Router();

// POST /session/:user_id - Create a new session
router.post('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    // Validate user_id exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Generate unique session token
    const session_token = uuidv4();

    // Create and save session
    const session = new Session({
      session_token,
      user_id,
    });

    await session.save();

    return res.status(200).json({
      status: 'ok',
      data: {
        token: session_token,
      },
      message: 'session saved successfully',
    });
  } catch (err) {
    console.error('Session creation error:', err);
    return res.status(500).send('Failed to create session');
  }
});

// GET /validate_token - Validate a session token
router.get('/validate_token', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        status: 'error',
        data: {
          valid: false,
          user: null,
        },
        message: 'Token is required',
      });
    }

    // Find session by token
    const session = await Session.findOne({ session_token: token }).populate('user_id');

    if (!session) {
      return res.status(401).json({
        status: 'error',
        data: {
          valid: false,
          user: null,
        },
        message: 'Invalid or expired token',
      });
    }

    // Return user data
    return res.status(200).json({
      status: 'ok',
      data: {
        valid: true,
        user: {
          first_name: session.user_id.first_name,
          last_name: session.user_id.last_name,
          id: session.user_id._id,
        },
      },
      message: null,
    });
  } catch (err) {
    console.error('Token validation error:', err);
    return res.status(500).send('Failed to validate token');
  }
});

export default router;
