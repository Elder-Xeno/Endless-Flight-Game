/*----- constants -----*/
// constants of player, obstacles, score counter, game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameMenuCanvas = document.getElementById("gameMenu");
const gameMenuCtx = gameMenuCanvas.getContext("2d");
const gameName = "Box Escape";
const spawnProbability = 0.6;

const player = {
  x: 0, // left and right
  y: canvas.height / 2, // top and bottom
  width: 96, // width and height are the size of the player
  height: 46,
  color: "black",
  speed: 10,
};

const obstacleMid = {
  x: canvas.width,
  y: canvas.height / 2,
  width: 96,
  height: 86,
  color: "black",
  speed: 6,
  initialSpeed: 6,
};

const obstacleTop = {
  x: canvas.width,
  y: 100,
  width: 116,
  height: 296,
  color: "black",
  speed: 4,
  initialSpeed: 4,
};

const obstacleBottom = {
  x: canvas.width,
  y: canvas.height,
  width: 196,
  height: 226,
  color: "black",
  speed: 5,
  initialSpeed: 5,
};

const obstacles = [obstacleMid, obstacleTop, obstacleBottom];

const playButton = {
  x: gameMenuCanvas.width / 2 - 50,
  y: gameMenuCanvas.height / 2 - 25,
  width: 100,
  height: 50,
};

// ctx.moveTo(0, 0);
// ctx.lineTo(801, 601) //account for 1px border for edges
// ctx.stroke();

/*----- state variables -----*/

let movingUp = false;
let movingDown = false;
let frameCounter = 0; // this will increment once per frame in the game loop to spawn obstacles and control their frequency.
const spawnFrequency = 5; // Decrease this value to increase the spawn frequency
let timer = 0; // Variable to track game duration in seconds
let score = 0;
let gameStarted = false;
let startCountdownTimer = 4;
let gameOver = false;
let highScore = localStorage.getItem("highScore") || 0;

/*----- cached elements  -----*/

/*----- event listeners -----*/

document.addEventListener("keydown", function (evt) {
  handleKeyPress(evt.key, true);
  // console.log(evt.code)
});

document.addEventListener("keyup", function (evt) {
  handleKeyPress(evt.key, false);
});

document.addEventListener("click", function (evt) {
  if (
    evt.clientX >= playButton.x &&
    evt.clientX <= playButton.x + playButton.width &&
    evt.clientY >= playButton.y &&
    evt.clientY <= playButton.y + playButton.height
  ) {
    startGame();
  }
});

canvas.addEventListener("click", function (event) {
  if (gameOver) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if the click is within the restart button
    if (
      mouseX >= canvas.width / 2 - 60 &&
      mouseX <= canvas.width / 2 + 60 &&
      mouseY >= canvas.height / 2 + 60 &&
      mouseY <= canvas.height / 2 + 100
    ) {
      restartGame();
    }
  }
});
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
  drawMenu();
}

function render() {
  clearCanvas();

  if (!gameOver) {
    drawPlayer();
    updatePlayer();
    drawObstacle();
    updateObstacle();
    drawScore();
    // method tells the browser that I want to perform an animation. Makes animation smoother.
    requestAnimationFrame(render);
  } else {
    drawGameOverScreen();
  }
}

function startGame() {
  gameMenuCanvas.style.display = "none";
  gameStarted = true;

  const startCountdownInterval = setInterval(() => {
    startCountdownTimer--;

    if (startCountdownTimer <= 0) {
      clearInterval(startCountdownInterval);
      // Start the actual game after the countdown
      obstacles.forEach((obs) => {
        obs.x = canvas.width;
        obs.speed = obs.initialSpeed;
      });
      render();
    } else {
      // Redraw the game canvas with updated countdown
      clearCanvas();
      drawScore();
    }
  }, 1000);
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.strokeStyle = "rgb(83,254,17)";
  ctx.lineWidth = 2;
  ctx.fillRect(
    player.x - player.width / 2,
    player.y - player.height / 2,
    player.width,
    player.height
    );
    ctx.strokeRect(
      player.x - player.width / 2,
      player.y - player.height / 2,
      player.width,
      player.height
    );
}

function drawObstacle() {
  obstacles.forEach((obs) => {
    ctx.fillStyle = obs.color;
    ctx.strokeStyle = "rgb(254,188,20)";
    ctx.lineWidth = 2;
    ctx.fillRect(
      obs.x - obs.width / 2,
      obs.y - obs.height / 2,
      obs.width,
      obs.height
      );
      ctx.strokeRect(
        obs.x - obs.width / 2,
        obs.y - obs.height / 2,
        obs.width,
        obs.height
    );
  });
}

function updateObstacle() {
  obstacles.forEach((obs) => {
    obs.x -= obs.speed;
    if (obs.x + obs.width / 2 < 0) { // Reset obstacle position if obs go off left
      obs.x = canvas.width + obs.width / 2;
      obs.y = getRandomPosition(obs);
    }
  });
  frameCounter++;
  timer++;
  if (timer % 120 === 0) { // Check if its time to speed up the game
    obstacles.forEach((obs) => {
      obs.speed += 1;
    });
  }
  const adjustedSpawnFrequency = //calculates average speed of obstacles and adjusts spawn frequency based on total
    spawnFrequency *
    (obstacles.reduce((sum, obs) => sum + obs.speed, 0) /
      (10 * obstacles.length));

  // Spawn a new obstacle every spawnFrequency frame
  if (frameCounter % adjustedSpawnFrequency === 0) {

    for (let i = 0; i < 2; i++) {
      const randomObstacle = Math.floor(Math.random() * obstacles.length);
      const newObstacle = {
        ...obstacles[randomObstacle],
        x: canvas.width,
        y: getRandomPosition(obstacles[randomObstacle]),
      };
      if (checkSpace(newObstacle, 100)) {
        obstacles.push(newObstacle);
      }
    }
  }
  // Reset frame counter to avoid large numbers
  if (frameCounter > 2000) {
    frameCounter = 0;
  }

  if (checkCollision()) {
    console.log("Collision!");
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
  // Update the player's position
  if (movingUp && player.y - player.height / 2 > 0) {
    player.y -= player.speed;
  } else if (movingDown && player.y + player.height / 2 < canvas.height) {
    player.y += player.speed;
  }
}

function checkCollision() {
  for (const obs of obstacles) {
    //The right, left, bottom and top boundaries of the player
    const playerRight = player.x + player.width / 2.3;
    const playerLeft = player.x - player.width / 2.3;
    const playerBottom = player.y + player.height / 2.3;
    const playerTop = player.y - player.height / 2.3;

    //The right, left, bottom and top boundary for each obstacle
    const obsRight = obs.x + obs.width / 2.3;
    const obsLeft = obs.x - obs.width / 2.3;
    const obsBottom = obs.y + obs.height / 2.3;
    const obsTop = obs.y - obs.height / 2.3;

    //compare the coordinates
    if (
      playerRight >= obsLeft &&
      playerLeft <= obsRight &&
      playerBottom >= obsTop &&
      playerTop <= obsBottom
    ) {
      // Adjust player position to prevent clipping through the obstacle
      player.y = obsTop - player.height / 2.3;
      gameOver = true;
      return true; // Collision detected
    }
  }
  return false; // No collision
}

function clearCanvas() {
  // Clear the canvas using method clearRect() Updates player position
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawScore() {
  if (startCountdownTimer > 0) {
    ctx.font = "40px 'Press Start 2P', cursive";
    ctx.fillStyle = "white";
    ctx.fillText(startCountdownTimer, canvas.width / 2 - 20, canvas.height / 2);
  } else {
    score = Math.floor(timer / 10);// Increase the player's score based on time

    // Draw the black box
    const boxWidth = 120;
    const boxHeight = 40;
    ctx.fillStyle = "black";
    ctx.fillRect(10, 10, boxWidth, boxHeight);

    // Draw the score text
    ctx.fillStyle = "white";
    ctx.font = "20px 'Press Start 2P', cursive";
    ctx.fillText(`Score: ${score}`, 20, 30);
  }
}

function drawGameOverScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "50px 'Press Start 2P', cursive";
  ctx.fillText("Game Over!", canvas.width / 2 - 120, canvas.height / 2 - 50);

  ctx.font = "20px 'Press Start 2P', cursive";
  if (score > highScore) {
    ctx.fillText(
      `New High Score: ${score}`,
      canvas.width / 2 - 70,
      canvas.height / 2 + 10
    );
    highScore = score;
    localStorage.setItem("highScore", highScore);
  } else {
    ctx.fillText(
      `Your Score: ${score}`,
      canvas.width / 2 - 50,
      canvas.height / 2 + 10
    );
  }

  // Draw restart button
  ctx.fillStyle = "purple";
  ctx.fillRect(canvas.width / 2 - 45, canvas.height / 2 + 60, 120, 40);

  ctx.fillStyle = "white";
  ctx.font = "20px 'Press Start 2P', cursive";
  ctx.fillText("Play Again", canvas.width / 2 - 30, canvas.height / 2 + 85);
}

function drawMenu() {
  gameMenuCtx.fillStyle = "rgba(0, 0, 0, 0.7)";
  gameMenuCtx.fillRect(0, 0, gameMenuCanvas.width, gameMenuCanvas.height);

  // Display game name
  gameMenuCtx.fillStyle = "white";
  gameMenuCtx.font = "50px 'Press Start 2P', cursive";
  gameMenuCtx.fillText(gameName, gameMenuCanvas.width / 2 - 120, 100);

  gameMenuCtx.fillStyle = "white";
  gameMenuCtx.fillRect(
    playButton.x,
    playButton.y,
    playButton.width,
    playButton.height
  );

  gameMenuCtx.fillStyle = "black"; //Play button
  gameMenuCtx.font = "24px 'Press Start 2P', cursive";
  gameMenuCtx.fillText("Play", playButton.x + 25, playButton.y + 35);

  gameMenuCtx.fillStyle = "white"; // Display high score
  gameMenuCtx.font = "20px 'Press Start 2P', cursive";
  gameMenuCtx.fillText(`Highest Score: ${highScore}`, 20, 30);
}

function restartGame() {
  startCountdownTimer = 4;

  const restartCountdownInterval = setInterval(() => {
    startCountdownTimer--;

    if (startCountdownTimer <= 0) {
      clearInterval(restartCountdownInterval);
      player.x = 0;
      player.y = canvas.height / 2;

      obstacles.forEach((obs) => {
        obs.x = canvas.width;
        obs.speed = obs.initialSpeed;
      });

      // Reset game variables
      timer = 0;
      score = 0;
      frameCounter = 0;
      // Reset gameOver variable
      gameOver = false;
      render();
    } else {
      clearCanvas();
      drawScore();
    }
  }, 1000);

  // Update high score if the current score is higher
  if (score > highScore) {
    highScore = score;
    drawGameOverScreen();
    localStorage.setItem("highScore", highScore);
    drawGameOverScreen(); // Redraw the game over screen
  }
}

init();
