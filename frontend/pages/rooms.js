// pages/rooms.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function RoomPage() {
  const [roomName, setRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [rooms, setRooms] = useState([]);
  const [nickname, setNickname] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/game/rooms', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

// pages/rooms.js

const createRoom = async () => {
    try {
        const response = await axios.post('http://localhost:3000/api/game/create', {
            roomName,
            isPrivate,
            password: isPrivate ? password : null
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('Room created successfully:', response.data); // Verify the room creation response
        fetchRooms(); // Refresh the room list
    } catch (error) {
        console.error('Failed to create room:', error.response?.data || error.message);
        alert('Room creation failed.');
    }
};


  const joinRoom = async (roomId) => {
    try {
      await axios.post('http://localhost:3000/api/game/join', {
        roomId,
        nickname,
        password: selectedRoom?.isPrivate ? roomPassword : null
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      router.push('/game'); // Redirect to game page after joining the room
    } catch (error) {
      console.error('Failed to join room:', error);
      alert('Failed to join room. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Create or Join a Room</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          <span className="ml-2">Private Room</span>
        </label>
        {isPrivate && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded"
          />
        )}
        <button onClick={createRoom} className="px-4 py-2 bg-blue-600 text-white rounded">
          Create Room
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Room Name</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Players</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.id}>
              <td className="border p-2">{room.roomName}</td>
              <td className="border p-2">{room.status}</td>
              <td className="border p-2">{room.players}/4</td>
              <td className="border p-2">
                <button onClick={() => setSelectedRoom(room)}>Join</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRoom && (
        <div className="mt-4">
          <h3>Join {selectedRoom.roomName}</h3>
          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          {selectedRoom.isPrivate && (
            <input
              type="password"
              placeholder="Room Password"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              className="mb-2 p-2 border border-gray-300 rounded"
            />
          )}
          <button onClick={() => joinRoom(selectedRoom.id)} className="px-4 py-2 bg-green-600 text-white rounded">
            Enter Game
          </button>
        </div>
      )}
    </div>
  );
}
