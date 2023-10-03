const canvas = document.getElementById("gameSnake");
const context = canvas.getContext("2d");

const interval = 80;
const boxSize = 32;
let direction;
let score = 0;
let stopSwitchDirection = false;
let gameOver = false;

// игровое поле
const background = new Image();
background.src = "picture/background.png";

// еда
const foodImage = new Image();
foodImage.src = "picture/food.png";

// Спаун еды
let food = {};

function randomFood() {
    food.x = (Math.floor(Math.random() * 17 + 1)) * boxSize;
    food.y = (Math.floor(Math.random() * 15 + 3)) * boxSize;
}

randomFood();

// змея
let snake = [{ x: boxSize * 9, y: boxSize * 10} ];

document.addEventListener("keydown", switchDirection);

// смена направления движения
function switchDirection(event) {
    if(!stopSwitchDirection) {
        switch(event.keyCode) {
        case 38:
            if(direction !== "down") { direction = "up" };
            break;
        case 40:
            if(direction !== "up") { direction = "down" };
            break;
        case 39:
            if(direction !== "left") { direction = "right" };
            break;
        case 37:
            if(direction !== "right") { direction = "left" };
            break;
        }
        stopSwitchDirection = true;
    }
    setTimeout(() => { stopSwitchDirection = false; }, 80);
}



let drawGame = setInterval(game, interval);

// игра
function game() {
    context.drawImage(background, 0, 0);
    context.drawImage(foodImage, food.x, food.y, boxSize, boxSize);

    context.fillStyle = "#0d31d4";
    for(let i = 0; i < snake.length; i++) {
        context.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }

    context.fillStyle = "white";
    context.font = "35px Arial";
    context.fillText(score, boxSize * 2, boxSize * 1.6);

    // Сохраняем позицию головы змейки
    let headX = snake[0].x;
    let headY = snake[0].y;

    switch(direction) {
        case "up":
            headY -= boxSize;
            break;
        case "down":
            headY += boxSize;
            break;
        case "right":
            headX += boxSize;
            break;
        case "left":
            headX -= boxSize;
            break;
    }

    // Создаем новый сегмент для головы
    let newHead = { x: headX, y: headY };

    if(newHead.x == food.x && newHead.y == food.y) {
        randomFood();
        score++;
        console.log(snake);
    } else {
        snake.pop();
    }

    snake.unshift(newHead);

    // логика проигрыша, если голова змеи встречается с телом, то игра заканчивается
    for(let i = 1; i < snake.length; i++) {
        if(headX == snake[i].x && headY == snake[i].y) {
            gameOver = true;
        }
    }
    // остановка игры
    if(gameOver) {
        let record = localStorage.getItem("Счет");
        if(score > record) {
            localStorage.setItem("Счет", score);
        }
        clearInterval(drawGame);
    };

    // При достижении конца поля по Х или Y змейка появляется с противоположной стороны
    if(newHead.x < boxSize) {
        newHead.x = canvas.width - boxSize * 2;
    } else if(newHead.x > (canvas.width - boxSize * 2)) {
        newHead.x = boxSize;
    } else if(newHead.y < boxSize * 3) {
        newHead.y = canvas.height - boxSize * 2;
    } else if(newHead.y > (canvas.height - boxSize * 2)) {
        newHead.y = boxSize * 3;
    }
}
