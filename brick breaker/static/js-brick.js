$(document).ready(function() {
    var canvas = $("#gameCanvas")[0];
    var ctx = canvas.getContext("2d");
    var ballRadius = 12;
    var paddleHeight = 20;
    var paddleWidth = 90;
    var paddleX = (canvas.width - paddleWidth) / 2;
    
    var brickRowCount = 5;
    var brickColumnCount = 9;
    var brickWidth = 75;
    var brickHeight = 25;
    var brickPadding = 10;
    var brickOffsetTop = 45;
    var brickOffsetLeft = (canvas.width - ((brickWidth + brickPadding) * brickColumnCount - brickPadding)) / 2;
    
    var bricks = [];
    var score = 0;
    var multiplier = 1;
    var gameOver = false;
    var replay = false;
    var rightPressed = false;
    var leftPressed = false;
    var x = canvas.width / 2;
    var y = canvas.height - 50;
    var dx = 3;
    var dy = -3;
    var gameStarted = false;

    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
            var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
            bricks.push({ x: brickX, y: brickY });
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#03dac6";  
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#03dac6";
        ctx.fill();
        ctx.closePath();
        ctx.shadowBlur = 0;
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#bb86fc"; 
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#bb86fc";
        ctx.fill();
        ctx.closePath();
        ctx.shadowBlur = 0;
    }

    function drawBricks() {
        const crystalColors = [
            "#00ffff", "#0088ff", 
            "#ff00ff", "#cc00ff",
            "#ffff00", "#ff8800", 
            "#00ff88", "#00ff00",
            "#ff0088", "#ff0000"  
        ];
        
        for (var i = 0; i < bricks.length; i++) {
            ctx.beginPath();
            ctx.rect(bricks[i].x, bricks[i].y, brickWidth, brickHeight);
            
            var row = Math.floor(i / brickColumnCount);
            ctx.fillStyle = crystalColors[row];
            
            ctx.shadowBlur = 15;
            ctx.shadowColor = crystalColors[row];
            ctx.fill();
            ctx.closePath();
            ctx.shadowBlur = 0;
            
            ctx.beginPath();
            ctx.moveTo(bricks[i].x + 10, bricks[i].y + 5);
            ctx.lineTo(bricks[i].x + 20, bricks[i].y + 5);
            ctx.lineTo(bricks[i].x + 5, bricks[i].y + 20);
            ctx.closePath();
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.fill();
        }
    }

    function drawScore() {
        $("#scoreValue").text(score);  
        ctx.font = "20px 'Segoe UI', sans-serif";
        ctx.fillStyle = "#03dac6";
        ctx.fillText("SCORE: " + score, 40, 30);
    }

    function drawStartText() {
        ctx.font = "28px 'Segoe UI', sans-serif";
        ctx.fillStyle = "#bb86fc";
        ctx.textAlign = "center";
        ctx.fillText("Press SPACE or Tap to Start", canvas.width / 2, canvas.height / 2);
    }

    function collisionDetection() {
        for (var i = 0; i < bricks.length; i++) {
            var b = bricks[i];
            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                dy = -dy;
                bricks.splice(i, 1);
                score += multiplier;
                multiplier++;
                if (bricks.length === 0) {
                    gameOver = true;
                }
            }
        }
    }

    function resetGame() {
        bricks = [];
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks.push({ x: brickX, y: brickY });
            }
        }
        score = 0;
        multiplier = 1;
        gameOver = false;
        replay = false;
        x = canvas.width / 2;
        y = canvas.height - 50;
        dx = 3;
        dy = -3;
    }

    function startGame() {
        gameStarted = true;
        $("#startText").remove();
        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        collisionDetection();

        if (gameOver) {
            ctx.font = "36px 'Segoe UI', sans-serif";
            ctx.fillStyle = "#ff7597";
            ctx.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2 - 30);
            ctx.font = "20px 'Segoe UI', sans-serif";
            ctx.fillStyle = "#bb86fc";
            ctx.fillText("Press SPACE or Tap to Replay", canvas.width / 2, canvas.height / 2 + 20);
            
            if (replay) {
                resetGame();
            }
        } else {
            if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
                dx = -dx;
            }
            if (y + dy < ballRadius) {
                dy = -dy;
            } else if (y + dy > canvas.height - ballRadius) {
                if (x > paddleX && x < paddleX + paddleWidth) {
                    dy = -dy;
                    multiplier = 1;
                } else {
                    gameOver = true;
                }
            }

            if (rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += 7;
            } else if (leftPressed && paddleX > 0) {
                paddleX -= 7;
            }

            x += dx;
            y += dy;
        }

        requestAnimationFrame(draw);
    }

    function keyDownHandler(e) {
        if (e.keyCode === 39) {
            rightPressed = true;
        } else if (e.keyCode === 37) {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode === 39) {
            rightPressed = false;
        } else if (e.keyCode === 37) {
            leftPressed = false;
        }
    }

    $("#leftButton").on("mousedown touchstart", function() {
        leftPressed = true;
    }).on("mouseup touchend", function() {
        leftPressed = false;
    });

    $("#rightButton").on("mousedown touchstart", function() {
        rightPressed = true;
    }).on("mouseup touchend", function() {
        rightPressed = false;
    });

    $(document).on("keydown click", function(e) {
        if (!gameStarted && (e.keyCode === 32 || e.target === canvas)) {
            startGame();
        } else if (gameOver && (e.keyCode === 32 || e.target === canvas)) {
            replay = true;
        }
    });

    $(window).on("load", function() {
        drawStartText();
    });

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
});