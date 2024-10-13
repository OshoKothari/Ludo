// controllers/gameController.js

const db = require('../config/database'); // Ensure you have your database connection set up correctly

// Function to create a new room
exports.createRoom = async (req, res) => {
    const { roomName, isPrivate, password } = req.body;
    const { user_id } = req.user;

    try {
        const result = await db.query(
            'INSERT INTO rooms (name, is_private, password, creator_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [roomName, isPrivate, isPrivate ? password : null, user_id, 'waiting']
        );
        
        console.log('Room created successfully:', result.rows[0]); // This will output the full room object
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Failed to create room' });
    }
};

// Function to list all available rooms
exports.listRooms = async (req, res) => {
    try {
        console.log('Fetching list of available rooms...');
        
        const result = await db.query(
            `SELECT id, name AS "roomName", is_private AS "isPrivate", status,
            (SELECT COUNT(*) FROM players WHERE room_id = rooms.id) AS players
            FROM rooms`
        );
        
        console.log('Rooms fetched:', result.rows);
        res.status(200).json(result.rows); // Ensure this is sending the correct data
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};

// Function to join an existing room
exports.joinRoom = async (req, res) => {
    const { roomId, nickname, password } = req.body;
    const { user_id } = req.user; // Extract user_id from the JWT middleware

    try {
        console.log('Attempting to join room:', { roomId, nickname, password });

        // Retrieve room details
        const roomResult = await db.query('SELECT * FROM rooms WHERE id = $1', [roomId]);
        const room = roomResult.rows[0];

        if (!room) {
            console.log('Room not found');
            return res.status(404).json({ error: 'Room not found' });
        }

        // Check password if room is private
        if (room.is_private && room.password !== password) {
            console.log('Incorrect password for private room');
            return res.status(401).json({ error: 'Incorrect room password' });
        }

        // Check if the room is already full
        const playerCountResult = await db.query(
            'SELECT COUNT(*) AS player_count FROM players WHERE room_id = $1',
            [roomId]
        );
        const playerCount = parseInt(playerCountResult.rows[0].player_count, 10);

        if (playerCount >= 4) {
            console.log('Room is already full');
            return res.status(400).json({ error: 'Room is already full' });
        }

        // Add player to the room
        await db.query(
            'INSERT INTO players (user_id, room_id, nickname) VALUES ($1, $2, $3)',
            [user_id, roomId, nickname]
        );

        // Update room status to 'started' if 4 players have joined
        if (playerCount + 1 === 4) {
            await db.query('UPDATE rooms SET status = $1 WHERE id = $2', ['started', roomId]);
        }

        console.log('Joined room successfully');
        res.status(200).json({ message: 'Joined room successfully' });
    } catch (error) {
        console.error('Error joining room:', error); // Log any error encountered during joining a room
        res.status(500).json({ error: 'Failed to join room' });
    }
};
