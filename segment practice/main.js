const canvas = document.querySelector('canvas')
canvas.height=window.innerHeight
canvas.width=window.innerWidth
const ctx = canvas.getContext('2d')

let t=0;
const A = {x:200, y:150}
const B = {x:150, y:250}
const C = {x:50, y:100}
const D = {x:250, y:200}
animate()


function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height)
    ctx.beginPath()
    ctx.moveTo(A.x, A.y)
    ctx.lineTo(B.x,B.y)
    ctx.moveTo(C.x, C.y)
    ctx.lineTo(D.x,D.y)
    ctx.stroke()
    
    drawPoint({x:A.x,y: A.y}, "A")
    drawPoint({x:B.x,y: B.y}, "B")
    drawPoint({x:C.x,y: C.y}, "C")
    drawPoint({x:D.x,y: D.y}, "D")
    
    const M = {
        x:lerp(A.x, B.x, t),
        y:lerp(A.y, B.y, t)
    }
    
    drawPoint({x:M.x, y:M.y}, "M")
    t+=0.005
    requestAnimationFrame(animate)
}



function lerp(A,B, t){
return A+(B-A)*t
}


function drawPoint (point, text){
    ctx.beginPath()
ctx.fillStyle="white";
ctx.arc(point.x, point.y, 10, 0, Math.PI*2)
ctx.fill()
ctx.stroke()
ctx.fillStyle="black"
ctx.textAlign="center"
ctx.textBaseline="middle"
ctx.font="bold 14px Arial"
ctx.fillText(text,point.x,point.y)
}