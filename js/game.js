import { Player } from "./GameObject/Player.js";
import { Platform } from "./GameObject/Platform.js";
import { Asteroid } from "./GameObject/Asteroid.js";
import { Joystick, Button } from "https://esm.sh/@rbuljan/gamepad@2.0.4";

const ControllerPanorama = new Joystick({
    id: "joystick-panorama",
    parentElement: document.querySelector("body"),
    axis: "x",
    spring: true, // Don't reset (center) joystick on touch-end
    radius: 80,
    position: {
        left: "20%",
        top: "80%",
    },
    onInput(state) {
        player.velocityX = Player.moveSpeed * (state.value);

    },
});

const ControllerMenu = new Button({
    id: "button-jump",
    parentElement: document.querySelector("body"),
    spring: false, // Act as a checkbox
    text: "Jump",
    radius: 40,
    position: {
        left: "80%",
        top: "80%",
    },
    style: {
        color: "#fff",
        background: "rgba(0,0,0,0.2)",
    },
    onInput(state) {
        if (player.isGrounded) {
            player.jump();
        }
    },
});
ControllerMenu.init();
ControllerPanorama.init();

const cnv = document.querySelector("canvas");
cnv.width = "2000";
cnv.height = "1000";
const ctx = cnv.getContext("2d");

let leftKey = false;
let rightKey = false;

let scale;

let player;

let platforms = [];
let asteroids = [];

/*
document.addEventListener("keydown", (event) => {
    if (event.key == "w") {
        if (player.isGrounded) {
            player.jump();
        }
    }
    if (event.key == "a") {
        rightKey = true;
    }
    if (event.key == "d") {
        leftKey = true;
    }

})
document.addEventListener("keyup", (event) => {
    if (event.key == "a") {
        rightKey = false;
    }
    if (event.key == "d") {
        leftKey = false;
    }

})*/


let oldTime = 0;
function gameLoop(time) {
    let deltaTime = time - oldTime;
    deltaTime /= 40;

    /*
    if (rightKey) {
        player.velocityX = -Player.moveSpeed;
    }

    if (leftKey) {
        player.velocityX = Player.moveSpeed;
    }

    if (rightKey && leftKey || !rightKey && !leftKey) {
        player.velocityX = 0;
    }*/

    if (!isNaN(deltaTime) && oldTime > 400) {
        updateGame(deltaTime);
        renderGame();
    }


    oldTime = time;
    requestAnimationFrame(gameLoop);
}

function updateGame(deltaTime) {

    if (asteroids.length < oldTime / 3000) {
        asteroids.push(createAsteroid());
    }


    player.update(deltaTime);

    player.checkCollision(platforms);

    if (player.posY > scale) {
        gameOver();
        throw "Game Finised";
    }

    for (const key in asteroids) {
        const element = asteroids[key];
        if (element != undefined) {
            element.update(deltaTime);

            if (element.intersectPlayer(player)) {
                gameOver();
                throw "Game Finised";
            }
            if (element.intersect({ posX: 0, posY: 0, width: scale * 2, height: scale }) == false) {
                asteroids[key] = createAsteroid();

            }
        }
    }

}

function random(min, max) {
    return parseInt(Math.random() * max + min);
}

function createAsteroid() {
    let asteroids;
    if (random(0, 2) == 0) {
        let side = random(0, 2);
        asteroids = new Asteroid(
            side == 0 ? 0 : 2 * scale - Asteroid.width - 10,
            random(1, scale - 1));
    }
    else {
        asteroids = new Asteroid(
            random(1, scale * 2 - 1),
            1);
    }

    let deltaX = asteroids.posX - player.posX;
    let deltaY = asteroids.posY - player.posY;
    let deltaPyt = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    asteroids.velocityX = -(deltaX / deltaPyt) * scale * 0.01
    asteroids.velocityY = -(deltaY / deltaPyt) * scale * 0.01

    return asteroids;
}


function renderGame() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.fillStyle = "#01afffff";
    ctx.beginPath();
    player.draw(ctx);
    ctx.fill();

    ctx.fillStyle = "#7cee47ff";
    ctx.beginPath();
    for (const element of platforms) {
        element.draw(ctx);
    }
    ctx.fill();

    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    for (const element of asteroids) {
        element.draw(ctx);
    }

    ctx.fill();
    ctx.font = "48px Franklin Gothic Medium ";
    ctx.fillText("Score : " + Math.round(oldTime / 1000), 10, 50);
}

function init(width, height) {

    scale = Math.min(height, width / 2);
    Player.gravity = scale * 0.015;
    Player.width = scale * 0.04;
    Player.height = scale * 0.06;
    Player.jumpForce = scale * 0.12
    Player.moveSpeed = scale * 0.04;
    player = new Player(scale - Player.width / 2, scale * 0.8 - Player.height);

    Asteroid.width = scale * 0.06;
    Asteroid.height = scale * 0.06;

    platforms = [
        new Platform(scale * 0.2, scale * 0.8, scale * 1.6, scale * 0.05),
        new Platform(scale * 0.3, scale * 0.55, scale * 0.3, scale * 0.05),
        new Platform(scale * 1.4, scale * 0.55, scale * 0.3, scale * 0.05),
        new Platform(scale * 0.85, scale * 0.35, scale * 0.3, scale * 0.05),
    ];
    renderGame();
    requestAnimationFrame(gameLoop);
}

function gameOver() {
    window.location.href = "index.html";
    console.log("GG");
}

document.querySelector("#start").addEventListener("click", () => {

    init(cnv.width, cnv.height);
})