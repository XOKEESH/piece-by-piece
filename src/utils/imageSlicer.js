export const sliceImage = (imageSrc, rows, cols) => {
    const pieces = []
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    const img = new Image()
    img.src = imageSrc

    return new Promise((resolve) => {
        img.onload = () => {
            const pieceWidth = img.width / cols
            const pieceHeight = img.height / rows

            canvas.width = pieceWidth
            canvas.height = pieceHeight

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    ctx.clearRect(0, 0, pieceWidth, pieceHeight)
                    ctx.drawImage(
                        img,
                        x * pieceWidth,
                        y * pieceHeight,
                        pieceWidth,
                        pieceHeight,
                        0,
                        0,
                        pieceWidth,
                        pieceHeight
                    )
                    pieces.push(canvas.toDataURL())
                }
            }

            resolve(pieces)
        }
    })
}
