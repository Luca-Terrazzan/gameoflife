console.log('starting...')

const SCALE = 32
const CANVAS_HEIGHT = Math.round(1080 / SCALE)
const CANVAS_WIDTH = Math.round(1920 / SCALE)

function createEmptyGrid() {
    return Array.from(Array(CANVAS_WIDTH), () => Array(CANVAS_HEIGHT))
}

const gridCanvas = document.getElementById('screen-canvas')
const ctx = gridCanvas.getContext("2d");

let grid = createEmptyGrid()
let nextGrid = createEmptyGrid()

function createRandomInitialState() {
    const totalPoints = 1200
    for (let i = 0; i < totalPoints; i++) {
        const hPos = Math.floor(Math.random() * (CANVAS_WIDTH - 1))
        const vPos = Math.floor(Math.random() * (CANVAS_HEIGHT - 1))
        grid[hPos][vPos] = true
    }
    // grid[10][10] = true
    // grid[10][11] = true
    // grid[10][12] = true
}
createRandomInitialState()

function displayCell(x, y) {
    ctx.fillStyle = "#000000"
    ctx.beginPath();
    ctx.arc(x*SCALE + SCALE/2, y*SCALE + SCALE/2, SCALE/2, 0, 2 * Math.PI);
    ctx.fill()
}

function getNeighbours(x, y) {
    let count = 0
    for (let xx = x-1; xx < x+2; xx++) {
        for (let yy = y-1; yy < y+2; yy++) {
            if (xx < 0 || yy < 0) continue
            if (xx === x && yy === y) continue
            if (xx > CANVAS_WIDTH -1|| yy > CANVAS_HEIGHT-1) continue
            if (grid[xx][yy] === true) count++
        }
    }

    return count
}

function clearCanvas(canvasContext) {
    canvasContext.clearRect(0, 0, CANVAS_WIDTH * SCALE, CANVAS_HEIGHT * SCALE);
}

function play() {
    console.log('playing...')

    clearCanvas(ctx)

    // update grid
    for (let x = 0; x < CANVAS_WIDTH; x++) {
        for (let y = 0; y < CANVAS_HEIGHT; y++) {
            if (grid[x][y] === true) {
                const neighbours = getNeighbours(x, y)
                console.log('displaying point', x, y)
                console.log('point has ', neighbours, ' neighbours')
                displayCell(x, y)
            }
        }
    }

    // updating grid
    for (let x = 0; x < CANVAS_WIDTH; x++) {
        for (let y = 0; y < CANVAS_WIDTH; y++) {
            let neighbours = 0
            try {
                neighbours = getNeighbours(x, y)
            } catch (e) {
                console.error(e)
            }
            if (grid[x][y] === true) {
                // console.log('cell ', x, y, ' is alive, and...')
                if (neighbours < 2) {
                    // console.log('dies of underpop')
                    nextGrid[x][y] = undefined
                } else if (neighbours < 4) {
                    // console.log('survives')
                    nextGrid[x][y] = grid[x][y]
                } else {
                    console.log('dies of overpop')
                    nextGrid[x][y] = undefined
                }
            } else {
                if (neighbours === 3) {
                    console.log('cell ', x, y, ' is dead, but is activated now')
                    nextGrid[x][y] = true
                }
                // dead cell and nothing happens
            }
        }
    }

    // Move to next grid step
    grid = nextGrid
    nextGrid = createEmptyGrid()
}

setInterval(play, 10)
