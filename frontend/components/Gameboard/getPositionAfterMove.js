const getPositionAfterMove = (pawn, rolledNumber) => {
    const { position } = pawn;
    if (position + rolledNumber <= 73) {
        return position + rolledNumber;
    }
    return position;
};

export default getPositionAfterMove;
