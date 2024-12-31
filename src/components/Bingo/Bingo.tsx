import React, { useState, useEffect } from 'react';

const Bingo = () => {
  const gridSize = 5;
  const [board, setBoard] = useState<number[][]>([]);
  const [marked, setMarked] = useState<boolean[][]>(Array(gridSize).fill(Array(gridSize).fill(false)));
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    // Generate a random Bingo board with unique numbers from 1 to 75
    const generateBoard = () => {
      const numbers = Array.from({ length: 75 }, (_, i) => i + 1);
      const shuffle = (arr: number[]) => arr.sort(() => Math.random() - 0.5);
      const shuffledNumbers = shuffle(numbers).slice(0, gridSize * gridSize);
      
      const newBoard = Array.from({ length: gridSize }, (_, i) =>
        shuffledNumbers.slice(i * gridSize, (i + 1) * gridSize)
      );
      
      setBoard(newBoard);
    };

    generateBoard();
  }, []);

  const handleCellClick = (row: number, col: number) => {
    const newMarked = marked.map((r, i) => r.map((cell, j) => (i === row && j === col ? !cell : cell)));
    setMarked(newMarked);
    checkForWin(newMarked);
  };

  const checkForWin = (markedBoard: boolean[][]) => {
    // Check rows and columns
    for (let i = 0; i < gridSize; i++) {
      if (markedBoard[i].every(cell => cell) || markedBoard.map(row => row[i]).every(cell => cell)) {
        setHasWon(true);
        return;
      }
    }

    // Check diagonals
    if (
      markedBoard.every((row, i) => row[i]) ||
      markedBoard.every((row, i) => row[gridSize - i - 1])
    ) {
      setHasWon(true);
    }
  };

  const resetGame = () => {
    setMarked(Array(gridSize).fill(Array(gridSize).fill(false)));
    setHasWon(false);
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>Bingo Game</h1>
      {hasWon ? <h2>🎉 Bingo! You Win! 🎉</h2> : <h2>Mark your Bingo card</h2>}
      <div style={{ display: 'inline-block', marginTop: '20px' }}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((num, colIndex) => (
              <button
                key={colIndex}
                style={{
                  width: '60px',
                  height: '60px',
                  margin: '5px',
                  fontSize: '20px',
                  backgroundColor: marked[rowIndex][colIndex] ? '#4CAF50' : '#f0f0f0',
                  color: marked[rowIndex][colIndex] ? 'white' : 'black',
                  cursor: 'pointer',
                }}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {num}
              </button>
            ))}
          </div>
        ))}
      </div>
      <button onClick={resetGame} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '18px' }}>
        Reset Game
      </button>
    </div>
  );
};

export default Bingo;
