const canvas = document.querySelector('canvas')
canvas.height=window.innerHeight
canvas.width=window.innerWidth
const ctx = canvas.getContext('2d')

const cellSize = 80;

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


let centerRow = 0;
let centerCol = 0;
const numRows = map.length;
const numCols = map[0].length;
centerRow=Math.floor(numRows / 2)
centerCol=Math.floor(numCols / 2)

const renderMap = (map)=>{
    console.log("rendermap")

    map.map((row,x)=>row.map((cell, y)=>{
        if(cell){
            ctx.fillStyle="gray"
   
        }
        if(!cell){
            ctx.fillStyle="black"
            
        }
        ctx.fillRect(y*cellSize,x*cellSize, cellSize, cellSize)
    }))
}

const detectMapCollision = (map)=>{
  // Get player size in canvas coordinates
  const playerWidth = cellSize / 5;
  const playerHeight = cellSize / 5;

  // Calculate the player’s canvas position
  const playerCanvasX = player.x * cellSize;
  const playerCanvasY = player.y * cellSize;

  let isCollision = false;

  // Iterate through map cells
  map.forEach((row, x) => row.forEach((cell, y) => {
      if (cell) { // If the cell is a wall
          const boxX = y * cellSize;
          const boxY = x * cellSize;
          const boxWidth = cellSize;
          const boxHeight = cellSize;

          if (
              playerCanvasX < boxX + boxWidth &&
              playerCanvasX + playerWidth > boxX &&
              playerCanvasY < boxY + boxHeight &&
              playerCanvasY + playerHeight > boxY
          ) {
              // Collision detected
              isCollision = true;
          }
      }
  }));

  // Set player color based on collision state
  player.color = isCollision ? "red" : "white";
  
}



class Player{
    constructor({color,x,y,speed}){
        this.x=x,
        this.y=y,
        this.color=color,
        this.speed=speed,
        this.render=this.render
    }
    render(){
        ctx.fillStyle=this.color
        ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize/5,cellSize/5)
        console.log("I am rendered");
    }

    moveTowards (mouseX, mouseY){
        const playerCanvasX = this.x * cellSize + cellSize / 10; // Adjusted for player size
        const playerCanvasY = this.y * cellSize + cellSize / 10; 
        const dx = mouseX - this.x * cellSize
        const dy = mouseY - this.y * cellSize

        const distance = Math.sqrt(dx*dx+dy*dy)
        if(distance===0) return;
        
        
        const moveX = (dx / distance) * this.speed;
        const moveY = (dy / distance) * this.speed;
        
        this.x += moveX / cellSize;
        this.y += moveY / cellSize;

        ctx.strokeStyle="yellow"
        ctx.beginPath()
        ctx.lineWidth = 2;
        ctx.moveTo(playerCanvasX,playerCanvasY)
        ctx.lineTo(mouseX, mouseY)
        ctx.stroke();
        
    }
}

class Game{
    constructor({player}){
this.player=player
    }
    render(){
    console.log("rendergame")

renderMap(map)

    player.render()

    }
}


const player = new Player({color:"white", x:centerRow, y:centerCol+0.3, speed:2})
const game = new Game({player:player})


let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});


const animate = ()=>{
    ctx.clearRect(0,0,canvas.width, canvas.height)
    game.render()
    detectMapCollision(map)
    player.moveTowards(mouseX, mouseY);
    requestAnimationFrame(animate)
}



animate()