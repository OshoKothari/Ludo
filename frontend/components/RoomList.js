import { useState, useEffect } from 'react';
import axios from 'axios';

function RoomList() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        async function fetchRooms() {
            try {
                const response = await axios.get('http://localhost:3000/api/game/rooms', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        }

        fetchRooms();
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <th>Room Name</th>
                    <th>Status</th>
                    <th>Players</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {rooms.map(room => (
                    <tr key={room.id}>
                        <td>{room.roomName}</td> {/* Ensure this matches the alias from backend */}
                        <td>{room.status}</td>
                        <td>{room.players}/4</td>
                        <td>
                            <button>Join</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default RoomList;
