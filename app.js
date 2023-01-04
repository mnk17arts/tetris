
document.addEventListener('DOMContentLoaded', () => {


    const container = document.querySelector('.grid');

    // append 200 divs to the container
    for (let i = 0; i < 200; i++) {
        const div = document.createElement('div');
        container.appendChild(div);
    }

    // create 10 divs 
    for (let i = 0; i < 10; i++) {
        const div = document.createElement('div');
        div.classList.add('taken');
        container.appendChild(div);
    }

    let squares = Array.from(document.querySelectorAll('.grid div'));
    const width = 10;
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start');
    const pauseBtn = document.querySelector('#pause');
    const restartBtn = document.querySelector('#restart');
    const finalScore = document.querySelector('#final-score');
    const gameOverDiv = document.querySelector('.end-screen');
    const keyCode = document.querySelector('.keycodes');
    let timerId;
    let score = 0;

    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const jTetromino = [
        [0, 1, width + 1, width * 2 + 1],
        [2, width, width + 1, width + 2],
        [1, width + 1, width * 2 + 1, width * 2 + 2],
        [width, width + 1, width + 2, width * 2]
    ]

    const sTetromino = [
        [0, 1, width + 1, width + 2],
        [1, width, width + 1, width * 2],
        [0, 1, width + 1, width + 2],
        [1, width, width + 1, width * 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, jTetromino, sTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;
    let nextRandom = 0;

    // randomly select a Tetromino and its first rotation
    let randomTet = Math.floor(Math.random() * theTetrominoes.length);
    // console.log(randomTet);

    let current = theTetrominoes[randomTet][currentRotation];

    // console.log(theTetrominoes);

    // draw the first rotation in the first tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tet');
        })
    }

    // undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tet');
        })
    }

    // make the tetromino move down every second
    // timerId = setInterval(moveDown, 500);

    // assign functions to keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }

    document.addEventListener('keyup', control);

    // move down function
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    //  freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            // start a new tetromino falling
            // randomTet = Math.floor(Math.random() * theTetrominoes.length);
            randomTet = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[randomTet][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    // moveleft function
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if (!isAtLeftEdge) currentPosition -= 1;

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }

        draw();
    }

    // moveRight function
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if (!isAtRightEdge) currentPosition += 1;

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }

        draw();
    }

    // rotate the tetromino
    function rotate() {
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if (isAtRightEdge) {
            currentPosition -= 1;
        } else if (isAtLeftEdge) {
            currentPosition += 1;
        }
        
        undraw();
        currentRotation++;
        if (currentRotation === current.length ) {
            currentRotation = 0;
        }
        current = theTetrominoes[randomTet][currentRotation];
        draw();
    }


    // show up-next tetromino in mini-grid display
    const minigrid = document.querySelector('.mini-grid');
    const displayWidth = 4;
    let displayIndex = 0;
    // append 16 divs to the mini-grid
    for (let i = 0; i < 16; i++) {
        const div = document.createElement('div');
        minigrid.appendChild(div);
    }

    const displaySquares = document.querySelectorAll('.mini-grid div');

    // the Tetromino without rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
        [0, 1, displayWidth + 1, displayWidth * 2 + 1], // jTetromino
        [0, 1, displayWidth + 1, displayWidth + 2], // sTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
        [0, 1, displayWidth, displayWidth + 1], // oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetromino
    ]

    // display the shape in the mini-grid display
    function displayShape() {
        // remove any trace of a tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tet');
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tet');
        })
    }

    // add functionality to the start button
    startBtn.addEventListener('click', () => {
        if(!timerId) {
            draw();
            timerId = setInterval(moveDown, 500);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
            startBtn.classList.add('hide');
            pauseBtn.classList.remove('hide');
            keyCode.classList.remove('hide');

        }
    })

    // add functionality to the pause button
        pauseBtn.addEventListener('click', () => {
            if (timerId) {
                clearInterval(timerId);
                timerId = null;
            } else {
                timerId = setInterval(moveDown, 500);
                draw();
            }
        })    


    // remove full rows
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tet');
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => container.appendChild(cell));
            }
        }
    }

    // game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            finalScore.innerHTML = score;
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
            startBtn.classList.remove('hide');
            pauseBtn.classList.add('hide');
            gameOverDiv.classList.remove('hide');
        }
    }

    // add functionality to the restart button
    restartBtn.addEventListener('click', () => {
        
        location.reload();
    })

    const leftKey = document.querySelector('.left');
    const rightKey = document.querySelector('.right');
    const downKey = document.querySelector('.down');
    const upKey = document.querySelector('.rotate');

    leftKey.addEventListener('click', () => {
        moveLeft();
    }
    )

    rightKey.addEventListener('click', () => {
        moveRight();
    })

    downKey.addEventListener('click', () => {
        moveDown();
    })

    upKey.addEventListener('click', () => {
        rotate();
    })


})
