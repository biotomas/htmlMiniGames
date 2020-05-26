<!DOCTYPE HTML>
<html>

<head>
    <meta charset="UTF-8">
    <title>Age of Hexagons</title>
    <script src="multiplayer.js"></script>
</head>

<body>
    <h1>Battle for Hexagon Isle</h1>
    <?php 
    $gid = $_GET["gid"];
    if (!$gid) {
        echo '<input type="button" value="Host a Game" onclick="hostGame()">';
    } else {
        echo "<p>game url is <span id='gurl'>" . $gid . "</span></p>";
        echo "<form id='lobbyForm' action='play.php' method='post'>
        <input type='text' id='pl1' value='name1'/>
        </input>";
    }

    ?>

    <script>
        window.onload = function () {
            var gidSpan = document.getElementById('gurl');
            if (gidSpan) {
                gid = document.getElementById('gurl').innerHTML;
                document.getElementById('gurl').innerHTML = window.location.href;
            }
        }

        function hostGame() {
            console.log(window.location.href);
            window.location.href="?gid=44";
        }
    </script>
</body>
</html>