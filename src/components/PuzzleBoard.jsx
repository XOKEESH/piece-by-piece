import React, { useState, useEffect } from 'react'
import { sliceImage } from '../utils/imageSlicer'
import '../styles/Puzzle.css'

const PuzzleBoard = () => {
  const rows = 8 // Number of rows in the grid
  const cols = 8 // Number of columns in the grid
  const imageSrc = 'src/assets/puzzle-image.png'

  const [pile, setPile] = useState([]) // Holds all pieces in the pile
  const [grid, setGrid] = useState(Array(64).fill(null)) // 8x8 grid

  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const pieces = await sliceImage(imageSrc, rows, cols)
        if (pieces.length > 0) {
          const formattedPieces = pieces.map((pieceData, index) => ({
            id: index + 1,
            src: pieceData,
          }))

          // Shuffle the pieces randomly
        const shuffledPieces = formattedPieces.sort(() => Math.random() - 0.5)
        
        setPile(shuffledPieces)
      } else {
          console.error('Image slicing failed or no pieces returned')
        }
      } catch (error) {
        console.error('Error during image slicing:', error)
      }
    }

    fetchPieces()
  }, [])

  const handleDragStart = (e, piece, fromGrid) => {
    e.dataTransfer.setData('pieceId', piece.id)
    e.dataTransfer.setData('fromGrid', fromGrid) // Track if the piece is from the grid
  }

  const handleDrop = (e, cellIndex) => {
    const pieceId = Number(e.dataTransfer.getData('pieceId'))
    const fromGrid = e.dataTransfer.getData('fromGrid') === 'true'

    if (cellIndex === -1) {
      // Drop piece back into the pile
      setGrid(prevGrid =>
        prevGrid.map(cell => (cell && cell.id === pieceId ? null : cell))
      )
      const piece = grid.find(p => p && p.id === pieceId)
      setPile(prevPile => [...prevPile, piece])
      return
    }

    if (fromGrid) {
      // Piece is being moved within the grid
      setGrid(prevGrid => {
        const newGrid = [...prevGrid]
        const piece = prevGrid.find(p => p && p.id === pieceId)
        if (newGrid[cellIndex]) {
          // If target cell is occupied, move its piece to the pile
          const targetPiece = newGrid[cellIndex]
          setPile(prevPile => [...prevPile, targetPiece])
        }
        newGrid[cellIndex] = piece // Move dragged piece to target cell
        newGrid[prevGrid.findIndex(p => p && p.id === pieceId)] = null // Clear original cell
        return newGrid
      })
    } else {
      // Piece is being moved from the pile to the grid
      const piece = pile.find(p => p.id === pieceId)
      setGrid(prevGrid => {
        const newGrid = [...prevGrid]
        if (newGrid[cellIndex]) {
          // If target cell is occupied, move its piece to the pile
          const targetPiece = newGrid[cellIndex]
          setPile(prevPile => [...prevPile, targetPiece])
        }
        newGrid[cellIndex] = piece
        return newGrid
      })
      setPile(prevPile => prevPile.filter(p => p.id !== pieceId)) // Remove piece from pile
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault() // Allow dropping
  }

  return (
    <div className="puzzle-board">
      <div className="pile">
        <h3>Pile</h3>
        <div
          className="pile-container"
          onDrop={(e) => handleDrop(e, -1)} // Drop into the pile
          onDragOver={handleDragOver}
        >
          {pile.map(piece => (
            <div
              key={piece.id}
              className="puzzle-piece"
              draggable
              onDragStart={(e) => handleDragStart(e, piece, false)} // piece from pile
              style={{
                backgroundImage: `url(${piece.src})`,
                width: '80px',
                height: '80px',
              }}
            ></div>
          ))}
        </div>
      </div>
      <div className="grid">
        <h3>Grid</h3>
        <div className="grid-container">
          {grid.map((cell, index) => (
            <div
              key={index}
              className="grid-cell"
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
            >
              {cell && (
                <div
                  className="puzzle-piece"
                  draggable
                  onDragStart={(e) => handleDragStart(e, cell, true)} // piece from grid
                  style={{
                    backgroundImage: `url(${cell.src})`,
                    width: '100%',
                    height: '100%',
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PuzzleBoard