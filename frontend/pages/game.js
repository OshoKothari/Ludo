// pages/game.js

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function GamePage() {
  const [gameData, setGameData] = useState(null);
  const [diceValue, setDiceValue] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [pawns, setPawns] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch initial game data when the component loads
  useEffect(() => {
    fetchGameData();
  }, []);

  const fetchGameData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/game/state', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const { board, currentPlayer, pawns } = response.data;
      setGameData(board);
      setCurrentPlayer(currentPlayer);
      setPawns(pawns);
    } catch (error) {
      console.error('Failed to fetch game data:', error);
    }
  };

  const rollDice = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/game/roll', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setDiceValue(response.data.diceValue);
      setMessage(`You rolled a ${response.data.diceValue}`);
    } catch (error) {
      console.error('Failed to roll dice:', error);
    }
  };

  const movePawn = async (pawnId) => {
    if (diceValue === null) {
      setMessage('Roll the dice first!');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/game/move', { pawnId, steps: diceValue }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setDiceValue(null); // Reset dice after moving
      fetchGameData(); // Update game data after move
    } catch (error) {
      console.error('Failed to move pawn:', error);
    }
  };

  return (
    <div className="game-page">
      <h1>Ludo Game</h1>
      <p>{message}</p>

      {/* Display the game board */}
      <div className="game-board">
        {gameData && gameData.map((cell, index) => (
          <div key={index} className={`board-cell ${cell.type}`}>
            {cell.pawn && <div className={`pawn player-${cell.pawn.playerId}`} />}
          </div>
        ))}
      </div>

      {/* Dice and current turn */}
      <div className="game-controls">
        <p>Current Player: {currentPlayer}</p>
        <button onClick={rollDice} disabled={diceValue !== null}>Roll Dice</button>
        {diceValue && <p>Dice Rolled: {diceValue}</p>}
      </div>

      {/* Display pawns and movement options */}
      <div className="pawns-container">
        {pawns.map((pawn) => (
          <button key={pawn.id} onClick={() => movePawn(pawn.id)}>
            Move Pawn {pawn.id} (Pos: {pawn.position})
          </button>
        ))}
      </div>
    </div>
  );
}
