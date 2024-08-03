const canvas = document.querySelector('canvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const ctx = canvas.getContext('2d');

const cellSize = 50;

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 0, 1, 1, 1, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let centerRow = Math.floor(map.length / 2);
let centerCol = Math.floor(map[0].length / 2);

const renderMap = (map) => {
    map.map((row, y) => row.map((cell, x) => {
        ctx.fillStyle = cell ? "gray" : "black";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }));
};

const detectMapCollision = (map, playerX, playerY, playerSize) => {
    const playerLeft = playerX;
    const playerRight = playerX + playerSize;
    const playerTop = playerY;
    const playerBottom = playerY + playerSize;

    let isCollision = false;

    map.map((row, y) => row.map((cell, x) => {
        if (cell) {
            const wallLeft = x * cellSize;
            const wallRight = wallLeft + cellSize;
            const wallTop = y * cellSize;
            const wallBottom = wallTop + cellSize;

            if (
                playerRight > wallLeft &&
                playerLeft < wallRight &&
                playerBottom > wallTop &&
                playerTop < wallBottom
            ) {
                isCollision = true;
            }
        }
    }));

    return isCollision;
};

class Player {
    constructor({ color, x, y, speed }) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = speed;
        this.size = cellSize / 5;
    }

    render() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * cellSize, this.y * cellSize, this.size, this.size);
    }

    moveTowards(mouseX, mouseY) {
        const playerCanvasX = this.x * cellSize + this.size / 2;
        const playerCanvasY = this.y * cellSize + this.size / 2;
        const dx = mouseX - playerCanvasX;
        const dy = mouseY - playerCanvasY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance === 0) return;

        const moveX = (dx / distance) * this.speed;
        const moveY = (dy / distance) * this.speed;

        // Check collision
        const nextX = playerCanvasX + moveX - this.size / 2;
        const nextY = playerCanvasY + moveY - this.size / 2;
        const isCollision = detectMapCollision(map, nextX, nextY, this.size);
        this.color = isCollision ? "red" : "white";

        if (!isCollision) {
            this.x += moveX / cellSize;
            this.y += moveY / cellSize;
        }

        ctx.strokeStyle = "yellow";
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(playerCanvasX, playerCanvasY);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
    }
}

class Game {
    constructor({ player }) {
        this.player = player;
    }

    render() {
        renderMap(map);
        this.player.render();
    }
}

const player = new Player({ color: "white", x: centerRow, y: centerCol + 0.3, speed: 2 });
const game = new Game({ player: player });

let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render();
    player.moveTowards(mouseX, mouseY);
    requestAnimationFrame(animate);
}

animate();
