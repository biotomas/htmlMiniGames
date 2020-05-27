<!DOCTYPE HTML>
<html>

<head>
    <meta charset="UTF-8">
    <title>Age of Hexagons</title>
    <script src="multiplayer.js"></script>
    <script src="graphics.js"></script>
</head>

<body>
    <h1>Battle for Hexagon Isle</h1>
    <?php 
    $gid = $_GET["gid"];
    print_r($_GET);
    if (!$gid) {
        echo '<input type="button" value="Host a Game" onclick="hostGame()">';
    } else {
        echo "<p>game url is: <span id='gurl'>" . $gid . "</span></p>";
    }

    ?>

<form id='myform' method="post" action="play.php">
</form>

<table id='tab'>
    <tr id='r1'><td>Player 1:</td><td><input type='text' form='myform' name='pl1' id='pl1' oninput='changePlayerName(1)'/></td><td id='m1'></td></tr>
    <tr id='r2'><td>Player 2:</td><td><input type='text' form='myform' name='pl2' id='pl2' oninput='changePlayerName(2)'/></td><td id='m2'></td></tr>
    <tr id='r3'><td>Player 3:</td><td><input type='text' id='pl3' oninput='changePlayerName(3)'/></td><td id='m3'></td></tr>
    <tr id='r4'><td>Player 4:</td><td><input type='text' id='pl4' oninput='changePlayerName(4)'/></td><td id='m4'></td></tr>
    <tr id='r5'><td>Player 5:</td><td><input type='text' id='pl5' oninput='changePlayerName(5)'/></td><td id='m5'></td></tr>
    <tr id='r6'><td>Player 6:</td><td><input type='text' id='pl6' oninput='changePlayerName(6)'/></td><td id='m6'></td></tr>
    <tr id='r7'><td>Player 7:</td><td><input type='text' id='pl7' oninput='changePlayerName(7)'/></td><td id='m7'></td></tr>
    <tr id='r8'><td>Player 8:</td><td><input type='text' id='pl8' oninput='changePlayerName(8)'/></td><td id='m8'></td></tr>
</table>

<input type="text" form='myform' name="haha" value="lol"/>
<input type="submit" form='myform' value="Start The Game!" id="submit"/>

    <script>
        window.onload = function () {
            for (var index = 1; index <= 8; index++) {
                document.getElementById('r'+index).style.backgroundColor=playerColors[index];
            }
            var gidSpan = document.getElementById('gurl');
            if (gidSpan) {
                document.getElementById('tab').style.display="block";
                gid = document.getElementById('gurl').innerHTML;
                document.getElementById('gurl').innerHTML = window.location.href;
                joinGame();
                updateLobby();
            } else {
                document.getElementById('tab').style.display="none";
            }
        }

        function updateLobby() {
            var data = getLobbyData(gid)[0];

            console.log(data.players);
            for (var i = 1; i <= 8; i++) {
                document.getElementById("pl"+i).value = data["name" + (i-1)];
                if (i <= data.players) {
                    document.getElementById('r'+i).style.display="block";
                } else {
                    document.getElementById('r'+i).style.display="none";
                }
                if (i == myPlayerId) {
                    document.getElementById('pl'+i).disabled=false;
                } else {
                    document.getElementById('pl'+i).disabled=true;
                }
            }
            for (var i = data.players; i <= 8; i++) {

            }
            setTimeout(updateLobby, 1000);
        }

        function startTheGame() {
            for (var i = 1; i <= 8; i++) {
                document.getElementById('pl'+i).disabled=false;
            }
            //TODO ...

            document.getElementById("myform").submit();
        }

        function hostGame() {
            var gid = hostNewGame();
            window.location.href="?gid="+gid;
        }

        function joinGame() {
            myPlayerId = joinTheGame(gid);
            console.log("You joined as player " + myPlayerId);
        }

        function changePlayerName(playerId) {
            var text = document.getElementById("pl"+playerId).value;
            console.log(text.length);
            if (text.length >= 8) {
                document.getElementById("m"+playerId).innerHTML = " Name too long, max 8 characters allowed. ";
            } else if (!text.match(/^[A-Za-z0-9]+$/)) {
                document.getElementById("m"+playerId).innerHTML = " Invalid name, only letters and numbers are allowed. ";
            } else {
                console.log(playerId, text);
                setName(gid, playerId -1, text);
                document.getElementById("m"+playerId).innerHTML = "";
            }
        }
    </script>
</body>
</html>