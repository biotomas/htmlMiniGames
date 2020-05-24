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

// $gid = 548904107;
// $sql = "start transaction; select @player:=players+1 from lobby where gameId = {$gid}; update lobby set players=@player where gameId = {$gid}; commit;";
// echo $sql;
// $result = $conn->query($sql);
// print_r($result->fetch_assoc());


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
} else if ($op == 'host') {
	$tries = 0;
	while($tries < 10) {
		$rgid = rand();
		$sql = "SELECT gameId from lobby where gameId = '{$rgid}' limit 1";
		$result = $conn->query($sql);
		if (!$result->fetch_assoc()) {
			// gid not taken
			$sql = "INSERT INTO lobby (`gameId`, `players`) VALUES ('{$rgid}', 0)";
			$result = $conn->query($sql);
			echo $rgid;
			break;
		}
		$tries++;
	}
} else if ($op == 'getLobby') {
	$gid = $_POST['gid'];
	$sql = "SELECT * from lobby where gameId = '{$gid}'";
	$result = $conn->query($sql);
	$moves = [];
    while($row = $result->fetch_assoc()) {
        array_push($moves, $row);
	}
	echo json_encode($moves);
} else if ($op == 'join') {
	$gid = $_POST['gid'];
	//$sql = "start transaction; select @player:=max(players)+1 from lobby where gameId = '{$gid}'; update lobby set players=@player where gameId = '{$gid}'; commit;";
	$sql = "update lobby set players = players + 1 OUTPUT Inserted.players where gameId = '{$gid}'";
	//$sql = "select * from lobby";
	$result = $conn->query($sql);
	echo $conn->error;
	print_r($result);
	//print_r($result->fetch_assoc());
	//echo "finished querry " . $result;
	//print_r($result->fetch_assoc());
} else if ($op == 'set') {
	$gid = $_POST['gid'];
	$col = $_POST['col'];
	$val = $_POST['val'];
	$sql = "update lobby set '{$col}' = '{$val}' where gameId = '{$gid}'";
	$result = $conn->query($sql);
	echo $result->fetch_assoc();
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

