document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('tetris');
    const context = canvas.getContext('2d');
    const grid = 20;
    const rows = 25; // row
    const cols = 20; // column
    let rowCount = 1;
    let gameRunning = false;
    let board = Array.from({ length: rows }, () => Array(cols).fill(0));

    // colors
    const colors = [
        null,
        '#FF0D72',
        '#0DC2FF',
        '#0DFF72',
        '#F538FF',
        '#FF8E0D',
        '#FFE138',
        '#3877FF',
    ];

    // Shapes
    const SHAPES = {
        I: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        J: [
            [0, 2, 0],
            [0, 2, 0],
            [2, 2, 0]
        ],
        L: [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3]
        ],
        O: [
            [4, 4],
            [4, 4]
        ],
        S: [
            [0, 5, 5],
            [5, 5, 0],
            [0, 0, 0]
        ],
        T: [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0]
        ],
        Z: [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ],
    };

    // Rotate
    function rotate(matrix, direction = 1) {
        const N = matrix.length;
        const result = matrix.map(() => []);

        for (let y = 0; y < N; ++y) {
            for (let x = 0; x < N; ++x) {
                if (direction > 0) {
                    result[x][N - 1 - y] = matrix[y][x];
                } else {
                    result[N - 1 - x][y] = matrix[y][x];
                }
            }
        }
        return result;
    }

    function drawMatrix(matrix, offset) {
        context.scale(grid, grid);
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    context.fillStyle = colors[value];
                    context.fillRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
        context.scale(1 / grid, 1 / grid);
    }

    function draw() {
        context.fillStyle = '#000';
        context.fillRect(0, 0, canvas.width, canvas.height);

        drawMatrix(board, { x: 0, y: 0 });
        drawMatrix(player.matrix, player.pos);
    }

    function merge(board, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    board[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }

    function collide(board, player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                    (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    function playerDrop() {
        player.pos.y++;
        if (collide(board, player)) {
            player.pos.y--;
            merge(board, player);
            playerReset();
            boardSweep();
            updateScore();
        }
        dropCounter = 0;
    }

    function playerReset() {
        const pieces = 'ILJOTSZ';
        player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
        player.pos.y = 0;
        player.pos.x = (cols / 2 | 0) - (player.matrix[0].length / 2 | 0);
        if (collide(board, player)) {
            board.forEach(row => row.fill(0));
            player.score = 0; // reset score
            updateScore();
            alert('Game Over!');
        }
    }

    // keyboard control
    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            // Move block left
            player.pos.x--;
            if (collide(board, player)) {
                player.pos.x++;
            }
        } else if (event.key === 'ArrowRight') {
            // Move block right
            player.pos.x++;
            if (collide(board, player)) {
                player.pos.x--;
            }
        } else if (event.key === 'ArrowDown') {
            // Move block down
            playerDrop();
        } else if (event.key === 'ArrowUp' || event.key === ' ') {
            // Rotate block
            player.matrix = rotate(player.matrix);
            if (collide(board, player)) {
                player.matrix = rotate(player.matrix, -1);
            }
        }
    });

    function boardSweep() {
        let linesCleared = 0;
        outer: for (let y = board.length - 1; y > 0; --y) {
            for (let x = 0; x < board[y].length; ++x) {
                if (board[y][x] === 0) {
                    continue outer;
                }
            }
            const row = board.splice(y, 1)[0].fill(0);
            board.unshift(row);
            ++y;

            linesCleared++;

            if (linesCleared > 0) {
                player.score += linesCleared * 10;
                updateScore();
            }
        }
    }

    function updateScore() {
        document.getElementById('score').innerText = "Score:" + player.score;
    }

    function createPiece(type) {
        switch (type) {
            case 'I':
                return [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ];
            case 'J':
                return [
                    [0, 2, 0],
                    [0, 2, 0],
                    [2, 2, 0]
                ];
            case 'L':
                return [
                    [0, 3, 0],
                    [0, 3, 0],
                    [0, 3, 3]
                ];
            case 'O':
                return [
                    [4, 4],
                    [4, 4]
                ];
            case 'S':
                return [
                    [0, 5, 5],
                    [5, 5, 0],
                    [0, 0, 0]
                ];
            case 'T':
                return [
                    [0, 6, 0],
                    [6, 6, 6],
                    [0, 0, 0]
                ];
            case 'Z':
                return [
                    [7, 7, 0],
                    [0, 7, 7],
                    [0, 0, 0]
                ];
            default:
                throw new Error('Unknown shape type');
        }
    }


    const player = {
        pos: { x: 0, y: 0 },
        matrix: null,
        score: 0,
    };

    function startGame() {
        if (gameRunning) return;
        document.getElementById('startButton').style.display = 'none';
        gameRunning = true;
        playerReset();
        updateScore();
        update();
    }

    let dropCounter = 0;
    let dropInterval = 1000; // 1 second
    let lastTime = 0;

    function update(time = 0) {
        if (!gameRunning) return;

        const deltaTime = time - lastTime;
        lastTime = time;

        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
            playerDrop();
        }

        draw();
        requestAnimationFrame(update);
    }

    document.getElementById('startButton').addEventListener('click', startGame);
});