import React, { useEffect, useRef, useContext, useState } from 'react';
import { PlayerDataContext, SocketContext } from '../../App';
import mapImage from '../../images/map.jpg';
import positionMapCoords from './positions'; // Import coordinates
import pawnImages from '../../constants/pawnImages'; // Import pawn images
import canPawnMove from './canPawnMove'; // Import pawn movement logic
import getPositionAfterMove from './getPositionAfterMove'; // Import position logic

const Map = ({ pawns, nowMoving, rolledNumber }) => {
    const player = useContext(PlayerDataContext);
    const socket = useContext(SocketContext);
    const canvasRef = useRef(null);
    const [hintPawn, setHintPawn] = useState();

    const paintPawn = (context, pawn) => {
        const { x, y } = positionMapCoords[pawn.position];
        const image = new Image();
        image.src = pawnImages[pawn.color];
        image.onload = () => {
            context.drawImage(image, x - 17, y - 15, 35, 30);
        };
    };

    const handleCanvasClick = (event) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const cursorX = event.clientX - rect.left;
        const cursorY = event.clientY - rect.top;

        for (const pawn of pawns) {
            if (ctx.isPointInPath(pawn.touchableArea, cursorX, cursorY) && canPawnMove(pawn, rolledNumber)) {
                socket.emit('game:move', pawn._id);
            }
        }
        setHintPawn(null);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.src = mapImage;
        image.onload = () => {
            ctx.drawImage(image, 0, 0);
            pawns.forEach((pawn) => {
                pawn.touchableArea = paintPawn(ctx, pawn);
            });
            if (hintPawn) {
                paintPawn(ctx, hintPawn);
            }
        };
    }, [hintPawn, pawns]);

    return (
        <canvas
            className='canvas-container'
            width={460}
            height={460}
            ref={canvasRef}
            onClick={handleCanvasClick}
        />
    );
};

export default Map;
