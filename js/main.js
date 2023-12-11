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

const obstacle = {
    x: canvas.width,
    y: canvas.height / 2,
    width: 60,
    height: 50,
    color: "blue",
    speed: 5,
};

const obstacles = [];

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

function init(){
console.log("Game initialized.");
    render();
};

function render(){
    drawPlayer();
    updatePlayer();
    drawObstacle();
    updateObstacle();
//method tells the browser that I want to perform an animation. Makes animation smoother.
    requestAnimationFrame(render)
};

//checking the positioning of objects
// function getCursorPosition(canvas, event) {
//     const rect = canvas.getBoundingClientRect()
//     const x = event.clientX - rect.left
//     const y = event.clientY - rect.top
//     console.log("x: " + x + " y: " + y)
// }
// canvas.addEventListener('mousedown', function(e) {
//     getCursorPosition(canvas, e)
// });

function drawPlayer(){
// Clear the canvas using method clearRect() Updates player position
    ctx.clearRect(0, 0, canvas.width, canvas.height);
// Draw the player on the canvas
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
};

function drawObstacle() {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x - obstacle.width / 2, obstacle.y - obstacle.height / 2, obstacle.width, obstacle.height);
}

// Function to update the obstacle's position
function updateObstacle() {
    obstacle.x -= obstacle.speed;
// Check for collision with the player
if (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
) {
// Handle collision
        console.log("Collision!");
            alert("Game Over!");

// Reset player and obstacle positions
        player.x = 0;
        player.y = canvas.height / 2;
        obstacle.x = canvas.width;
}
// Reset obstacle position if it goes off the left side of the canvas
    if (obstacle.x + obstacle.width/2 < 0) {
        obstacle.x = canvas.width + obstacle.width / 2;
    }
}

function handleKeyPress(key, isPressed){
    movingUp = (key === "ArrowUp" || key === "w") && isPressed;
    movingDown = (key === "ArrowDown" || key === "s") && isPressed;
};

function updatePlayer(){
// Update the player's position and check for collisions with obstacles
    if (movingUp && player.y - player.height / 2 > 0){
        player.y -= player.speed;
    }else if (movingDown && player.y + player.height / 2 < canvas.height){
        player.y += player.speed;
    }
};
//function drawScore()
// Update and display the current score on the canvas

init();