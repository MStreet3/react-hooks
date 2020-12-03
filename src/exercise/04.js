// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function GameHistory({history, onClickHandler}) {
  function calculateButtonText(index, isActive) {
    const text = index === 0 ? 'game start' : `move #${index}`
    return `Go to ${text}${isActive ? ' (current)' : ''}`
  }
  return (
    <ol>
      {history
        .filter(item => item)
        .map((item, i) => {
          return (
            <li key={`history-entry-${i}`}>
              <button
                disabled={item.isActive}
                onClick={() => onClickHandler(history, i)}
              >
                {calculateButtonText(i, item.isActive)}
              </button>
            </li>
          )
        })}
    </ol>
  )
}

function Board() {
  const [squares, setSquares] = useLocalStorageState(
    'squares',
    Array(9).fill(null),
  )

  const [activeBoard, setActiveBoard] = React.useState(0)

  const [history, setHistory] = useLocalStorageState('tic-tac-toe:history', [
    {
      squares: Array(9).fill(null),
      isActive: true,
    },
  ])

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    if (calculateWinner(squares) || squares[square]) {
      return
    }

    const squaresCopy = [...squares]

    squaresCopy[square] = calculateNextValue(squares)

    const nextActiveBoard = activeBoard + 1
    setActiveBoard(nextActiveBoard)

    const historyCopy = history.map(entry => {
      if (entry) {
        return {...entry, isActive: false}
      }
      return entry
    })

    historyCopy[nextActiveBoard] = {
      squares: squaresCopy,
      isActive: true,
    }

    setHistory(historyCopy)

    setSquares(squaresCopy)
  }

  function restart() {
    setSquares(Array(9).fill(null))
    setActiveBoard(0)
    setHistory([
      {
        squares: Array(9).fill(null),
        isActive: true,
      },
    ])
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  function onClickHandler(history, i) {
    const updatedHistory = history.map((entry, j) => {
      if (entry) {
        return {...entry, isActive: j === i}
      }
      return entry
    })

    setHistory(updatedHistory)
    setSquares(updatedHistory[i].squares)
    setActiveBoard(i)
  }

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <div>
        <div className="status">
          {calculateStatus(
            calculateWinner(squares),
            squares,
            calculateNextValue(squares),
          )}
        </div>
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <GameHistory
          {...{
            history,
            onClickHandler,
          }}
        />
      </div>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
