const express = require('express');
const { createRoom, listRooms, joinRoom } = require('../controllers/gameController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authenticateToken, createRoom); // Ensure this route exists
router.get('/rooms', authenticateToken, listRooms);
router.post('/join', authenticateToken, joinRoom);

module.exports = router;
