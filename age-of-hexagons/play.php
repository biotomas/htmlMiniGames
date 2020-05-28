﻿<!DOCTYPE HTML>
<html>

<head>
    <meta charset="UTF-8">
    <title>Age of Hexagons</title>
    <style type="text/css">
        canvas {
            margin: auto;
            overflow: hidden;
            border: 1px solid #000;
        }
    </style>
    <script src="input.js"></script>
    <script src="level.js"></script>
    <script src="gameLogic.js"></script>
    <script src="graphics.js"></script>
    <script src="maps.js"></script>
    <script src="buildMenu.js"></script>
    <script src="gameMaster.js"></script>
    <script src="hud.js"></script>
    <script src="animations.js"></script>
    <script src="multiplayer.js"></script>
</head>

<body>
    <div style="text-align:center; width:100%; height:100%">
        <canvas id="scene"></canvas>
        <p>Framerate: <span id="fps"></span></p>
        <p>Cursor: <span id="cursor"></span></p>
        <form>Player:<input type="text" id="player" onchange="setPlayer()"></form>
    </div>
    <script>

playerNames = ["nature", "Jessica", "Tomas", "Sebastian", "Marco", "Tim", "Julia"];
<?php
    echo "gameId = " . $_POST['gid'] .";";
    echo "mapId = " . $_POST['level'] .";";
    echo "players = " . $_POST['players'] .";";
    echo "localPlayer = " . $_POST['playerId'] .";";
    echo "playerNames[1] = '" . $_POST['pl1'] ."';";
    echo "playerNames[2] = '" . $_POST['pl2'] ."';";
    echo "playerNames[3] = '" . $_POST['pl3'] ."';";
    echo "playerNames[4] = '" . $_POST['pl4'] ."';";
    echo "playerNames[5] = '" . $_POST['pl5'] ."';";
    echo "playerNames[6] = '" . $_POST['pl6'] ."';";
    echo "playerNames[7] = '" . $_POST['pl7'] ."';";
    echo "playerNames[8] = '" . $_POST['pl8'] ."';";
?>

        function setPlayer() {
            var p = document.getElementById('player').value;
            localPlayer = p;
            console.log(p);
        }

        d = new Date();
        lastframe = d.getTime();
        lastkframe = d.getTime();
        framecount = 0;

        // multiplayer data
        multiPlayerGame = true;
        step = 1;

        window.onload = function () {
            c = document.getElementById('scene');
            initializeInput(c);
            c.width = window.innerWidth - 100;
            c.height = window.innerHeight - 100;
            cc = c.getContext('2d');
            setInterval(update, 1000 / 60);
            netUpdate();
        }


        currentLevel = Object.assign(new Level(1, 1), maps[mapId]);
        selectedUnit = null;
        reachableTiles = new Set();
        state = States.IDLE;
        gameMaster = new GameMaster(currentLevel, players);
        animation = new AnimationProvider();

        function netUpdate() {
            if (state != States.ANIMATION && multiPlayerGame) {
                if (gameMaster.currentPlayer != localPlayer) {
                    var moves = getMoves(gameId, step);
                    for (let move of moves) {
                        if (move.op == "go") {
                            gameMaster.moveUnit(gameMaster.currentPlayer,
                                move.fx, move.fy, move.tx, move.ty, animation);
                        }
                        if (move.op == "build") {
                            gameMaster.buildUnit(gameMaster.currentPlayer,
                                move.tx, move.ty, move.what);
                        }
                        if (move.op == "endTurn") {
                            gameMaster.endTurn(gameMaster.currentPlayer);
                        }
                        step++;
                        break;
                    }
                }
            }
            setTimeout(netUpdate, 200);
        }


        function update() {
            d = new Date();
            tnow = d.getTime();
            scrollCanvas();
            currentLevel.drawTiles(cc, tnow);
            if (animation.updateAnimations(cc, tnow)) {
                state = States.ANIMATION;
            } else if (state == States.ANIMATION) {
                state = States.IDLE;
            }


            mousePos = pixelsToCoords(mousex, mousey);
            mx = mousePos[0];
            my = mousePos[1];

            document.getElementById("cursor").innerHTML = mx + "," + my;

            if (state == States.MOVE) {
                cc.lineWidth = 3;
                cc.strokeStyle = "red";
                drawTileCursor(cc, selectedUnit.x, selectedUnit.y, tnow);
                cc.strokeStyle = "green";
                for (let value of reachableTiles) {
                    drawTileCursor(cc, value.x, value.y, tnow);
                }
                cc.lineWidth = 1;
                cc.strokeStyle = "black";
            }

            currentLevel.drawUnits(cc, tnow);
            drawBuildMenu(cc);
            drawHud(cc);
            framerate();
            if (checkEndTurnPressed()) {
                gameMaster.endTurn(gameMaster.currentPlayer);
                if (multiPlayerGame) {
                    sendEndTurn(gameId, step);
                    step++;
                }
            }

            if (state != States.ANIMATION
                && gameMaster.playerStates[gameMaster.currentPlayer].moves == 0) {
                gameMaster.endTurn(gameMaster.currentPlayer);
            }

            if (state != States.ANIMATION && multiPlayerGame) {
                if (gameMaster.currentPlayer != localPlayer) {
                    return;
                }
            }

            if (state == States.MENU) {
                updateBuildMenu();
            }

            while (!currentLevel.outOfBounds(mx, my)) {
                if (state == States.BUILD) {
                    cc.globalAlpha = 0.3;
                    drawImage(cc, unitImages[unitToBuild], mx, my);
                    cc.globalAlpha = 1;
                }
                if (keypressed('leftMouse')) {
                    var clickedItem = currentLevel.unitMap[mx][my];
                    var clickedPlayer = currentLevel.tileMap[mx][my];
                    var ownTile = clickedPlayer == gameMaster.currentPlayer;

                    if (ownTile && state == States.BUILD) {
                        if (gameMaster.canBuildUnit(gameMaster.currentPlayer,
                            mx, my, unitToBuild)) {
                            gameMaster.buildUnit(gameMaster.currentPlayer,
                                mx, my, unitToBuild);
                            if (multiPlayerGame) {
                                sendBuild(gameId, step, unitToBuild, mx, my);
                                step++;
                            }
                            state = States.IDLE;
                        }
                        break;
                    }
                    if (ownTile && clickedItem == Units.Town) {
                        if (state == States.MENU) {
                            state = States.IDLE;
                            buildMenuEnabled = false;
                        } else {
                            state = States.MENU;
                            buildMenuEnabled = true;
                        }
                        break;
                    }
                    if (state == States.MOVE) {
                        if (gameMaster.canMoveUnit(gameMaster.currentPlayer,
                            selectedUnit.x, selectedUnit.y, mx, my)) {
                            gameMaster.moveUnit(gameMaster.currentPlayer,
                                selectedUnit.x, selectedUnit.y, mx, my, animation);
                            if (multiPlayerGame) {
                                sendMove(gameId, step, selectedUnit.x, selectedUnit.y, mx, my);
                                step++;
                            }
                        }
                        state = States.IDLE;
                        break;
                    }
                    if (state != States.ANIMATION && ownTile && canMove(clickedItem)) {
                        selectedUnit = { "x": mx, "y": my };
                        reachableTiles = getReachableTiles(gameMaster, mx, my);
                        state = States.MOVE;
                        break;
                    }
                }
                break;
            }


        }

        function framerate() {
            d = new Date();
            tnow = d.getTime();
            tfr = tnow - lastframe;
            lastframe = tnow;

            framecount++;
            if (framecount > 30) {
                fps = Math.floor(1000 / ((tnow - lastkframe) / 30));
                framecount = 0;
                lastkframe = tnow;
                document.getElementById("fps").innerHTML = fps;
            }
        }
    </script>
</body>

</html>