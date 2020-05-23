<?php

// $servername = "md51.wedos.net";
// $username = "w225003_hexas";
// $password = "jirae44@fe233221FDDW";
// $dbname = "d225003_hexas";

$servername = "localhost";
$username = "hexas";
$password = "hexas";
$dbname = "hexas";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$op = $_POST['op'];

if ($op == 'move') {
	$gid = $_POST['gid'];
	$step = $_POST['step'];
	$move = $_POST['move'];
	$sql = "SELECT max(step) from gameMoves where gameId = '{$gid}'";
	$result = $conn->query($sql);
	$maxStep = $result->fetch_assoc()["max(step)"];
	if ($step == $maxStep + 1) {
		$sql = "INSERT INTO gameMoves (`gameId`, `step`, `move`) VALUES ('{$gid}', '{$step}', '{$move}')";
		//echo $sql;
		$result = $conn->query($sql);
		echo $result;
	} else {
		echo "invalid step";
	}
} else if ($op == 'get') {
	$gid = $_POST['gid'];
	$step = $_POST['step'];
	//$sql = "SELECT * from gameMoves WHERE gid='${gid}' AND step >= ${step}";
	$sql = "SELECT step,move from gameMoves where gameId='${gid}' and step >= ${step}";
	//echo $sql; 
	$result = $conn->query($sql);
	$moves = [];
    while($row = $result->fetch_assoc()) {
        array_push($moves, $row);
	}
	echo json_encode($moves);
}
$conn->close();
?>

