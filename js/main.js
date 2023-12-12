/*----- constants -----*/
// constants of player, obstacles, score counter, game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: 0, // left and right
  y: canvas.height / 2, // top and bottom
  width: 100, // width and height are the size of the player
  height: 50,
  color: "red",
  speed: 10,
};

const obstacleMid = {
  x: canvas.width,
  y: canvas.height / 2,
  width: 100,
  height: 90,
  color: "blue",
  speed: 3,
};

const obstacleTop = {
  x: canvas.width,
  y: 100,
  width: 120,
  height: 300,
  color: "green",
  speed: 4,
};

const obstacleBottom = {
  x: canvas.width,
  y: canvas.height,
  width: 220,
  height: 200,
  color: "purple",
  speed: 5,
};

const obstacles = [obstacleMid, obstacleTop, obstacleBottom];

let score = 0;

// ctx.moveTo(0, 0);
// ctx.lineTo(801, 601) //account for 1px border for edges
// ctx.stroke();

/*----- state variables -----*/

let movingUp = false;
let movingDown = false;

let frameCounter = 0; // this will increment once per frame in the game loop to spawn obstacles and control their frequency.
const spawnFrequency = 30; // Decrease this value to increase the spawn frequency

let timer = 0; // Variable to track game duration in seconds

/*----- cached elements  -----*/

/*----- event listeners -----*/

document.addEventListener("keydown", function (evt) {
  handleKeyPress(evt.key, true);
  // console.log(evt.code)
});

document.addEventListener("keyup", function (evt) {
  handleKeyPress(evt.key, false);
});
// keypress listener for keys that allow up and down movement for the player.

/*----- functions -----*/

// checking the positioning of objects
// function getCursorPosition(canvas, event) {
//     const rect = canvas.getBoundingClientRect()
//     const x = event.clientX - rect.left
//     const y = event.clientY - rect.top
//     console.log("x: " + x + " y: " + y)
// }
// canvas.addEventListener('mousedown', function(e) {
//     getCursorPosition(canvas, e)
// });

function init() {
  console.log("Game initialized.");
  render();
}

function render() {
  clearCanvas();
  drawPlayer();
  updatePlayer();
  drawObstacle();
  updateObstacle();
  drawScore();
  // method tells the browser that I want to perform an animation. Makes animation smoother.
  requestAnimationFrame(render);
}

function drawPlayer() {
  clearCanvas();
  // Draw the player on the canvas
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x - player.width / 2,
    player.y - player.height / 2,
    player.width,
    player.height
  );
}

function drawObstacle() {
  obstacles.forEach((obs) => {
    ctx.fillStyle = obs.color;
    ctx.fillRect(
      obs.x - obs.width / 2,
      obs.y - obs.height / 2,
      obs.width,
      obs.height
    );
  });
}

// Function to update the obstacle's position
function updateObstacle() {
  obstacles.forEach((obs) => {
    obs.x -= obs.speed;

    // Reset obstacle position if it goes off the left side of the canvas
    if (obs.x + obs.width / 2 < 0) {
      obs.x = canvas.width + obs.width / 2;
      // Adjusts the height at which the obstacle will respawn
      obs.y = getRandomPosition(obs);
    }
  });

  // Increase the frame counter
  frameCounter++;
  timer++;

  // Increase the player's score based on time
  score = Math.floor(timer / 60);

  // Adjust the spawn frequency based on player speed
  const adjustedSpawnFrequency = spawnFrequency * (player.speed / 10);

  // Spawn a new obstacle every spawnFrequency frame
  if (frameCounter % adjustedSpawnFrequency === 0) {
    console.log("Spawning obstacles!");
    for (let i = 0; i < 5; i++) {
      //spawn 5 obstacles at once
      const randomObstacle = Math.floor(Math.random() * obstacles.length);
      const newObstacle = {
        ...obstacles[randomObstacle],
        x: canvas.width, //Set the x coordinate of the new obstacle to the right edge of the canvas
        y: getRandomPosition(obstacles[randomObstacle]),
      };

      // Check if there is enough space between new obstacle and existing obstacles
      if (checkSpace(newObstacle, 100)) {
        obstacles.push(newObstacle);
      }
    }
  }
  // Reset frame counter to avoid large numbers
  if (frameCounter > 1000) {
    frameCounter = 0;
  }

  if (checkCollision()) {
    console.log("Collision!");
    alert("Game Over!");
    // Reset player position
    player.x = 0;
    player.y = canvas.height / 2;

    // Reset obstacles position
    obstacles.forEach((obs) => {
      obs.x = canvas.width;
    });
  }
}

function getRandomPosition(obstacle) {
  // Return Y position based on obstacle type
  if (obstacle === obstacleTop) {
    return 0;
  } else if (obstacle === obstacleMid) {
    return (
      canvas.height / 3 + Math.random() * (canvas.height / 2 - obstacle.height)
    );
  } else if (obstacle === obstacleBottom) {
    return canvas.height;
  }
}

function checkSpace(newObstacle, minSpace) {
  // Check if there is enough space between new obstacle and existing obstacles
  for (const obs of obstacles) {
    // Check if there is an overlap in the Y and X axis between the new obstacle and existing obstacles.
    if (
      Math.floor(newObstacle.y - obs.y) < minSpace &&
      newObstacle.x < obs.x + obs.width &&
      newObstacle.x + newObstacle.width > obs.x
    ) {
      return false; // Not enough space
    }
  }
  return true; // Enough space
}

function handleKeyPress(key, isPressed) {
  movingUp = (key === "ArrowUp" || key === "w") && isPressed;
  movingDown = (key === "ArrowDown" || key === "s") && isPressed;
}

function updatePlayer() {
  // Update the player's position and check for collisions with obstacles
  if (movingUp && player.y - player.height / 2 > 0) {
    player.y -= player.speed;
  } else if (movingDown && player.y + player.height / 2 < canvas.height) {
    player.y += player.speed;
  }
}

function checkCollision() {
  // Check for collision with the player. /2 to consider half the width or height of each object when comparing
  for (const obs of obstacles) {
    if (
      // Check if the right side of the player is greater than or equal to the left side of the obstacle.
      player.x + player.width / 2 >= obs.x - obs.width / 2 &&
      // Check if the left side of the player is less than or equal to the right side of the obstacle.
      player.x - player.width / 2 <= obs.x + obs.width / 2 &&
      // Check if the bottom side of the player is greater than or equal to the top side of the obstacle.
      player.y + player.height / 2 >= obs.y - obs.height / 2 &&
      // Check if the top side of the player is less than or equal to the bottom side of the obstacle.
      player.y - player.height / 2 <= obs.y + obs.height / 2
    ) {
      // Adjust player position to avoid clipping through the obstacle
      player.y = obs.y + obs.height / 2 + player.height / 2;
      return true; // Collision detected with any obstacle
    }
  }
  return false; // No collision with any obstacle
}

function clearCanvas() {
  // Clear the canvas using method clearRect() Updates player position
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function drawScore() {
  ctx.font = "20px 'Press Start 2P', cursive";
  ctx.fillText(`Score: ${score}`, 20, 30);
  ctx.fillStyle = "white";
}

init();
