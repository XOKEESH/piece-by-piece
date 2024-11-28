import React from 'react'
import Draggable from 'react-draggable'

const PuzzlePiece = ({ piece, onDrop }) => {
  return (
    <Draggable>
      <img
        src={piece.image}
        alt="Puzzle piece"
        className="puzzle-piece"
      />
    </Draggable>
  )
}

export default PuzzlePiece
