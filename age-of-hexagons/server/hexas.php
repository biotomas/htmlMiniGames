<?php
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
//var_dump($_POST);
//var_dump($_GET);

if ($op == 'move') {
	$gid = $_POST['gid'];
	$step = $_POST['step'];
	$move = $_POST['move'];
	$sql = "SELECT max(step) from gameMoves where gameId = '{$gid}'";
	$result = $conn->query($sql);
	$maxStep = $result->fetch_assoc()["max(step)"];
	echo "hello";
	echo $maxStep;
	echo "step is ";
	echo $step;
	if ($step == $maxStep + 1) {
		$sql = "INSERT INTO gameMoves (`gameId`, `step`, `move`) VALUES ('{$gid}', '{$step}', '{$move}')";
		echo $sql;
		$result = $conn->query($sql);
		var_dump($result);
		//var_dump($result->fetch_assoc());
		//$maxStep = $result->fetch_assoc()["max(step)"];
		echo "ok";
	} else {
		echo "nope";
	}
	die;

	$sql = "INSERT INTO gameMoves (`name`, `version`, `players`, `data`) VALUES ('{$name}', '{$version}', '{$players}', '{$data}')";
	$result = $conn->query($sql);
	echo "insert success";
} else if ($op == 'get') {
	$name = $_POST['name'];
	$version = $_POST['version'];
	$sql = "SELECT * from `d225003_hexas`.`levels` WHERE `name`='${name}' AND `version`=${version}";
	$result = $conn->query($sql);
	echo $result->fetch_assoc();
}

echo "<hr/>";
$sql = "SELECT * FROM gameMoves";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        var_dump($row);        
        echo "<br/>";
    }
} else {
    echo "0 results";
}
$conn->close();

echo $_GET['lol'];
?>

