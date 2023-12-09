/*----- constants -----*/

//constants of player, obstacles, score counter, game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.moveTo(0, 0);
ctx.lineTo(801, 601) //account for 1px border for edges
ctx.stroke();
/*----- state variables -----*/

//position, size and speed of player and obstacles
//obstacle creation rate
//how the score accumulates

/*----- cached elements  -----*/

/*----- event listeners -----*/

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

//function drawPlayer()
// Draw the player on the canvas

//function drawObstacles()
// Draw all obstacles on the canvas

//function drawScore()
// Update and display the current score on the canvas

//function updatePlayer()
// Update the player's position and check for collisions with obstacles

//function updateObstacles()
// Update the obstacles' positions, create new obstacles, and check for collisions

//function resetGame()
// Reset the game state
