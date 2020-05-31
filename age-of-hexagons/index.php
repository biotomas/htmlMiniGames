<!DOCTYPE HTML>
<html>

<head>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <meta charset="UTF-8">
    <title>Battle for Hexagon Isle</title>
    <script src="server.js"></script>
    <script src="graphics.js"></script>
    <style>
    body {
        font-size: 18px;
    }
    table, td{
        padding:10px;
    }
    </style>
</head>

<body>
    <h1>Battle for Hexagon Isle</h1>
    <?php
    $gid = $_GET["gid"];
    if (!$gid) {
        echo '<input type="button" value="Host a Game" onclick="hostGame()">';
    } else {
        echo "<p>game url is: <span id='gurl'>" . $gid . "</span></p>";
    }

    ?>

<form id='myform' method="post" action="play.php">
</form>

<table id='tab' style="display:none">
    <tr style="display:none" id="r0"><td>Level id:</td><td><input type='text' form='myform' name='level' id='level' oninput='changeLevel()' value="0"/></td><td></td></tr>
    <tr style="display:none" id='r1'><td>Player 1:</td><td><input type='text' form='myform' name='pl1' id='pl1'/></td><td id='m1'></td></tr>
    <tr style="display:none" id='r2'><td>Player 2:</td><td><input type='text' form='myform' name='pl2' id='pl2'/></td><td id='m2'></td></tr>
    <tr style="display:none" id='r3'><td>Player 3:</td><td><input type='text' form='myform' name='pl3' id='pl3'/></td><td id='m3'></td></tr>
    <tr style="display:none" id='r4'><td>Player 4:</td><td><input type='text' form='myform' name='pl4' id='pl4'/></td><td id='m4'></td></tr>
    <tr style="display:none" id='r5'><td>Player 5:</td><td><input type='text' form='myform' name='pl5' id='pl5'/></td><td id='m5'></td></tr>
    <tr style="display:none" id='r6'><td>Player 6:</td><td><input type='text' form='myform' name='pl6' id='pl6'/></td><td id='m6'></td></tr>
    <tr style="display:none" id='r7'><td>Player 7:</td><td><input type='text' form='myform' name='pl7' id='pl7'/></td><td id='m7'></td></tr>
    <tr style="display:none" id='r8'><td>Player 8:</td><td><input type='text' form='myform' name='pl8' id='pl8'/></td><td id='m8'></td></tr>
</table>

<input style="display:none" form='myform' name="gid" value="" id="gid"/>
<input style="display:none" form='myform' name="players" value="" id="players"/>
<input style="display:none" form='myform' name="playerId" value="" id="playerId"/>
<input style="display:none" type="submit" value="Start The Game!" id="submit" onclick="startTheGameHost()"/>

    <script>
        <?php echo "server = new MultiplayerServer('" . gethostname() . "');"; ?>

        window.onload = function () {
            for (var index = 1; index <= 8; index++) {
                document.getElementById('r'+index).style.backgroundColor=playerColors[index];
            }
            var gidSpan = document.getElementById('gurl');
            if (gidSpan) {
                document.getElementById('tab').style.display="";
                document.getElementById('submit').style.display="";
                gid = document.getElementById('gurl').innerHTML;
                document.getElementById('gurl').innerHTML = window.location.href;
                joinGame();
                server.refreshLobbyData(gid);
                updateLobby();
            } else {
                document.getElementById('tab').style.display="none";
                document.getElementById('submit').style.display="none";
            }
        }

        function updateLobby() {
            if (myPlayerId != 1) {
                document.getElementById('level').disabled=true;
                document.getElementById('submit').disabled=true;
            }
            if (server.lobbyData == null) {
                setTimeout(updateLobby, 100);
                return;
            }
            var data = server.lobbyData[0];
            server.refreshLobbyData(gid);
            document.getElementById('players').value = data.players;
            document.getElementById('gid').value = gid;
            document.getElementById('playerId').value = myPlayerId;
            for (var i = 1; i <= 8; i++) {
                var serverName = data["name" + (i-1)];
                if (i == myPlayerId) {
                    var localName = document.getElementById("pl"+i).value;
                    if (localName != serverName) {
                        changePlayerName(i);
                    }
                } else {
                    document.getElementById("pl"+i).value = serverName;
                }
                if (i <= data.players) {
                    document.getElementById('r'+i).style.display="";
                } else {
                    document.getElementById('r'+i).style.display="none";
                }
                if (i == myPlayerId) {
                    document.getElementById('pl'+i).disabled=false;
                } else {
                    document.getElementById('pl'+i).disabled=true;
                }
            }
            if (data.mapId != null) {
                document.getElementById('level').value = data.mapId;
                startTheGameGuest();
            } else {
                setTimeout(updateLobby, 500);
            }
        }

        function startTheGameHost() {
            for (var i = 1; i <= 8; i++) {
                document.getElementById('pl'+i).disabled=false;
            }
            document.getElementById('level').disabled=false;
            var mapId = document.getElementById('level').value;
            // this is the signal to the others to start for now
            server.setLevel(gid, mapId);
            document.getElementById("myform").submit();
        }

        function startTheGameGuest() {
            for (var i = 1; i <= 8; i++) {
                document.getElementById('pl'+i).disabled=false;
            }
            document.getElementById("level").disabled=false;
            document.getElementById("myform").submit();
        }

        function hostGame() {
            var gid = server.hostNewGame();
            window.location.href="?gid="+gid;
        }

        function joinGame() {
            myPlayerId = server.joinTheGame(gid);
            console.log("You joined as player " + myPlayerId);
        }

        function changeLevel() {
        }

        function changePlayerName(playerId) {
            var text = document.getElementById("pl"+playerId).value;
            if (text.length >= 8) {
                document.getElementById("m"+playerId).innerHTML = " Name too long, max 8 characters allowed. ";
            } else if (!text.match(/^[A-Za-z0-9]*$/)) {
                document.getElementById("m"+playerId).innerHTML = " Invalid name, only letters and numbers are allowed. ";
            } else {
                server.setName(gid, playerId -1, text);
                document.getElementById("m"+playerId).innerHTML = "";
            }
        }
    </script>
</body>
</html>