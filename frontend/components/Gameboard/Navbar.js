import React from 'react';
import styles from './Navbar.module.css'; // Create this CSS file for navbar styles

const Navbar = ({ players, started, time, isReady, movingPlayer, rolledNumber, nowMoving, ended }) => {
    return (
        <div className={styles.navbar}>
            {players.map(player => (
                <div key={player._id} className={styles.player}>
                    <span>{player.name}</span>
                    <span>{player.color}</span>
                </div>
            ))}
            <div>{`Rolled Number: ${rolledNumber}`}</div>
            <div>{`Time left: ${time}`}</div>
            {ended && <div>Game Over!</div>}
        </div>
    );
};

export default Navbar;
