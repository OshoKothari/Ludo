import React from 'react';
import styles from './Overlay.module.css'; // Create this CSS file for overlay styles

const Overlay = ({ children }) => {
    return (
        <div className={styles.overlay}>
            {children}
        </div>
    );
};

export default Overlay;
