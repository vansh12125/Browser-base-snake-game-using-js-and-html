const model = document.querySelector("#modal");
const modelContent = document.querySelector("#modal-content");

(function () {
  function startGame() {
    model.classList.remove("active");
    makeGrid();
    initialieSnakeAndFood();

    window.removeEventListener("keydown", handleStart);
    model.removeEventListener("click", startGame);
    model.removeEventListener("touchstart", startGame);
  }

  function handleStart() {
    startGame();
  }

  window.addEventListener("keydown", handleStart);
  model.addEventListener("click", startGame);
  model.addEventListener("touchstart", startGame);
})();

const mainHtmlGrid = document.querySelector("#main-grid");
const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");
const restartBtn = document.querySelector(".restart-btn-nav");
const gridArr = [];
const snake = [];
const rows = 20;
const cols = 20;
let gameLoop;
let foodX;
let foodY;
let direction = "left";
let playerScore = 0;
let playerHighScore = localStorage.getItem("h-s") || 0;
highScoreElement.textContent = playerHighScore;

const upBtn = document.querySelector("#up-btn");
const downBtn = document.querySelector("#down-btn");
const leftBtn = document.querySelector("#left-btn");
const rightBtn = document.querySelector("#right-btn");

const makeGrid = () => {
  // processMouseMove();
  gridArr.length = 0;
  mainHtmlGrid.innerHTML = "";
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const block = document.createElement("div");
      block.className = "block";
      // block.textContent = `${i},${j}`;
      mainHtmlGrid.appendChild(block);
      gridArr.push({
        x: i,
        y: j,
        elem: block,
      });
    }
  }
};

const initialieSnakeAndFood = () => {
  mainHtmlGrid.classList.add("hide-cursor");
  addFood();
  snake.length = 0;
  snake.unshift({
    x: Math.floor(Math.random() * 7) + 6,
    y: Math.floor(Math.random() * 7) + 6,
  });

  gameLoop = setInterval(() => {
    drawSnake();
    moveSnake();
  }, 200);
};

const drawSnake = function () {
  gridArr.forEach((cell) =>
    cell.elem.classList.remove("snake", "snake-head", direction),
  );

  snake.forEach(({ x, y }, index) => {
    const cell = gridArr[x * cols + y].elem;

    if (index === 0) {
      cell.classList.add("snake-head", direction);
    } else {
      cell.classList.add("snake");
    }
  });
};

const moveSnake = function () {
  const newHead = { ...snake[0] };
  //  gridArr[newHead.x * cols + newHead.y].elem.classList.add("snake");
  switch (direction) {
    case "up":
      newHead.x--;
      break;
    case "down":
      newHead.x++;
      break;
    case "left":
      newHead.y--;
      break;
    case "right":
      newHead.y++;
      break;
  }

  if (
    newHead.x < 0 ||
    newHead.x >= rows ||
    newHead.y < 0 ||
    newHead.y >= cols
  ) {
    gameOver();
    return;
  }

  if (snake.some((elem) => newHead.x === elem.x && newHead.y === elem.y)) {
    gameOver();
    return;
  }

  snake.unshift(newHead);

  if (newHead.x === foodX && newHead.y === foodY) {
    updateScore();
    addFood();
  } else {
    snake.pop();
  }
};

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
    if (direction !== "down") {
      direction = "up";
    }
  } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
    if (direction !== "up") {
      direction = "down";
    }
  } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
    if (direction !== "right") {
      direction = "left";
    }
  } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
    if (direction !== "left") {
      direction = "right";
    }
  }
});

const updateScore = () => {
  playerScore++;
  scoreElement.textContent = playerScore;

  if (playerScore > playerHighScore) {
    playerHighScore = playerScore;
    highScoreElement.textContent = playerHighScore;
    localStorage.setItem("h-s", playerHighScore);
  }
};

const gameOver = () => {
  model.classList.add("active");
  clearInterval(gameLoop);
  gameLoop = null;
  const h1 = document.createElement("h1");
  const h4 = document.createElement("h4");
  const restartBtnClone = restartBtn.cloneNode(true);
  restartBtnClone.addEventListener("click", restartGame);

  h1.textContent = "Game Over!";
  h4.textContent = `Your Score: ${playerScore}`;
  modelContent.innerHTML = "";
  modelContent.appendChild(h1);
  modelContent.appendChild(h4);
  modelContent.appendChild(restartBtnClone);
};

const addFood = () => {
  let index = foodX * cols + foodY;
  gridArr[index]?.elem?.classList.remove("food");

  do {
    foodX = Math.floor(Math.random() * rows);
    foodY = Math.floor(Math.random() * cols);
  } while (snake.some((segment) => segment.x === foodX && segment.y === foodY));
  index = foodX * cols + foodY;
  gridArr[index].elem.classList.add("food");
};

const restartGame = () => {
  mainHtmlGrid.classList.remove("hide-cursor");
  model.classList.remove("active");
  clearInterval(gameLoop);
  gameLoop = null;
  direction = "left";
  initialieSnakeAndFood();
  playerScore = 0;
  scoreElement.textContent = playerScore;
};

restartBtn.addEventListener("click", () => {
  restartGame();
});

upBtn.addEventListener("click", () => {
  if (direction !== "down") direction = "up";
});

downBtn.addEventListener("click", () => {
  if (direction !== "up") direction = "down";
});

leftBtn.addEventListener("click", () => {
  if (direction !== "right") direction = "left";
});

rightBtn.addEventListener("click", () => {
  if (direction !== "left") direction = "right";
});
// const trackIdleMouse = function (func, delay) {
//   let timeOut;

//   return function (...args) {
//     clearTimeout(timeOut);
//     mainHtmlGrid.classList.remove("hide-cursor");
//     timeOut = setTimeout(() => {
//       func.apply(this, args);
//     }, delay);
//   };
// };

// const handleIdle = function () {
//   mainHtmlGrid.classList.add("hide-cursor");
// };

// const processMouseMove = trackIdleMouse(handleIdle, 2000);

// mainHtmlGrid.addEventListener("mousemove", processMouseMove);
