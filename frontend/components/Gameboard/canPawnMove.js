const canPawnMove = (pawn, rolledNumber) => {
    if ((rolledNumber === 1 || rolledNumber === 6) && pawn.position === pawn.basePos) {
        return true;
    } else if (pawn.position !== pawn.basePos) {
        switch (pawn.color) {
            case 'red':
                return pawn.position + rolledNumber <= 73;
            case 'blue':
                return pawn.position + rolledNumber <= 79;
            case 'green':
                return pawn.position + rolledNumber <= 85;
            case 'yellow':
                return pawn.position + rolledNumber <= 91;
            default:
                return false;
        }
    }
    return false;
};

export default canPawnMove;
