// components/CreateRoomForm.js
import { useState } from 'react';
import axios from 'axios';

export default function CreateRoomForm({ onRoomCreated }) {
  const [roomName, setRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/api/game/create', {
        roomName,
        isPrivate,
        password: isPrivate ? password : null
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onRoomCreated(response.data);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Room Name" value={roomName} onChange={(e) => setRoomName(e.target.value)} required />
      <label>
        <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
        Private Room
      </label>
      {isPrivate && <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />}
      <button type="submit">Create Room</button>
    </form>
  );
}
