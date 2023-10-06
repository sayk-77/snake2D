const canvas = document.getElementById("gameSnake");
const context = canvas.getContext("2d");
const btnPausedPlay = document.getElementById("pausedPlay");
const btnRestart = document.getElementById("restart");

const boxSize = 32;
let snakeSpeed = 80;
let pulsSize = 1;
let pulseDirection = 1;
let record = (localStorage.getItem("Счет") ? localStorage.getItem("Счет") : 0);
let score = 0;
let stopSwitchDirection = false;
let gameOver = false;
let direction;
let gamePaused = false;

const background = new Image();
background.src = "picture/background.png";

const foodImage = new Image();
foodImage.src = "picture/food.png";

const recordCup = new Image();
recordCup.src = "picture/cup.png";

// создаем объект, хранящий координаты еды, так же создаем еду
let foodPosition = {};
let snake = [{ x: boxSize * 9, y: boxSize * 10} ];

randomFood();

document.addEventListener("keydown", switchDirection);

// основная функция
function game() {
    drawGame();
    gameLogic();
    setTimeout(() => {
        gameOver ? cancelAnimationFrame(game) : requestAnimationFrame(game)
    }, snakeSpeed);
}

function drawGame() {
    context.drawImage(background, 0, 0);
    context.drawImage(recordCup, boxSize * 4, boxSize / 1.6);
    pulsFood();

    context.fillStyle = "#0d31d4";
    // отображение каждого элемента змейки путем перебора массива с объеками
    for(let i = 0; i < snake.length; i++) {
        context.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }
    
    // кнопка пауза\продолжить
    btnPausedPlay.style.position = "absolute";
    btnPausedPlay.style.right = (canvas.offsetLeft + 15) + "px";
    btnPausedPlay.style.top = (canvas.offsetTop + 15) + "px";

    context.fillStyle = "white";
    context.font = "35px Arial";
    context.fillText(score, boxSize * 2, boxSize * 1.6);

    context.fillText(record, boxSize * 5, boxSize * 1.6)
}

// основная логика
function gameLogic() {
    // Сохраняем позицию головы змейки
    let headX = snake[0].x;
    let headY = snake[0].y;

    if(!gamePaused) {
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
    }

    // Создаем новый сегмент для головы
    let newHead = { x: headX, y: headY };

    if(newHead.x == foodPosition.x && newHead.y == foodPosition.y) {
        randomFood();
        score++;
        snakeSpeed = snakeSpeed - snakeSpeed * 0.01;
    } else {
        snake.pop();
    }
    
    // добавляем новый элемент змейки
    snake.unshift(newHead);

    // если голова змеи встречается с телом, то игра заканчивается
    for(let i = 1; i < snake.length; i++) {
        if(headX == snake[i].x && headY == snake[i].y) {
            gameOver = true;
        }
        if(gameOver) {
            if(score > record) {
                localStorage.setItem("Счет", score);
            }
            cancelAnimationFrame(game);
            upadateScoreAndHightScore(score, record);
            openModal();
        };
    }
    
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

// смена направления движения
function switchDirection(event) {
    if(!stopSwitchDirection && !gamePaused) {
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
    // создаем интервал между сменами направления, чтобы убрать возможность двигаться в
    // противоположную сторону путем быстрой смены направления движения
    setTimeout(() => { stopSwitchDirection = false; }, snakeSpeed);
}

// Присваивание случайных координат еде
function randomFood() {
    foodPosition.x = (Math.floor(Math.random() * 17 + 1)) * boxSize;
    foodPosition.y = (Math.floor(Math.random() * 15 + 3)) * boxSize;
    
    // если яблоко появилось внутри змеи, яблоко появляется в другом месте
    for(let i = 0; i < snake.length; i++) {
        if (foodPosition.x === snake[i].x && foodPosition.y === snake[i].y) {
            randomFood();
        }
    }
}

// смена изображения, установка флага gamePaused
btnPausedPlay.addEventListener("click", (() => {
    if(!gamePaused) {
        btnPausedPlay.src = "/picture/play.png";
    } else if(gamePaused) {
        btnPausedPlay.src = "/picture/paused.png";
    }
    gamePaused = !gamePaused;
}))

// вывод рекорда и счета на модальное окно
function upadateScoreAndHightScore(score, record) {
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    scoreElement.textContent = score;
    highScoreElement.textContent = record;
}

// анимация яблока
function pulsFood() {
    pulsSize += 0.01 * pulseDirection;

    if(pulsSize <= 0.7) {
        pulseDirection = 1;
    } else if(pulsSize >= 1) {
        pulseDirection = -1;
    }

    const foodSize = boxSize * pulsSize;

    const foodX = foodPosition.x - (foodSize - boxSize) / 2;
    const foodY = foodPosition.y - (foodSize - boxSize) / 2;

    context.drawImage(foodImage, foodX, foodY, foodSize, foodSize);
}

// запуск игры
requestAnimationFrame(game);