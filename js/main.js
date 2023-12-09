/*----- constants -----*/

//constants of player, obstacles, score counter, game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
    x: 0,
    y: canvas.height / 2,
    width: 101,
    height: 51,
    color: "red",
    speed: 10,
};


let score = 0;

// ctx.moveTo(0, 0);
// ctx.lineTo(801, 601) //account for 1px border for edges
// ctx.stroke();

/*----- state variables -----*/

let movingUp = false;
let movingDown = false;

//position, size and speed of player and obstacles
//obstacle creation rate
//how the score accumulates

/*----- cached elements  -----*/

/*----- event listeners -----*/

document.addEventListener("keydown", function(evt){
    handleKeyPress(evt.key, true);
    // console.log(evt.code)
});

document.addEventListener("keyup", function(evt) {
    handleKeyPress(evt.key, false);
});

//keypress listener for keys that allow up and down movement for player.

/*----- functions -----*/

//checking the positioning of objects
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)
}
canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})

function drawPlayer(){
    // Draw the player on the canvas
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    console.log("player")
};

//function drawObstacles()
// Draw all obstacles on the canvas

//function drawScore()
// Update and display the current score on the canvas

function handleKeyPress(key, isPressed){
    movingUp = (key === "ArrowUp" || key === "w") && isPressed;
    movingDown = (key === "ArrowDown" || key === "s") && isPressed;
};

function updatePlayer(){
// Update the player's position and check for collisions with obstacles
    if (movingUp){
        player.y -= player.speed;
    }else if (movingDown){
        player.y += player.speed;
    }
};

//function updateObstacles()
// Update the obstacles' positions, create new obstacles, and check for collisions

function init(){

}

function render(){

    drawPlayer();
    updatePlayer();
    requestAnimationFrame(render)
};


init();
render();