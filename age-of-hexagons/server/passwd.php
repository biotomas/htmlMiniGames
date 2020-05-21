<?php
echo "hello";

$servername = "md51.wedos.net";
$username = "w225003_hexas";
$password = "jirae44@fe233221FDDW";
$dbname = "d225003_hexas";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

echo "connection ok";
exit;

$op = $_POST['operation'];
var_dump($_POST);
var_dump($_GET);
echo "hello {$op}</br>";

if ($op == 'insert') {
	$name = $_POST['name'];
	$version = $_POST['version'];
	$players = $_POST['players'];
	$data = $_POST['data'];
	$sql = "INSERT INTO `d225003_hexas`.`levels` (`name`, `version`, `players`, `data`) VALUES ('{$name}', '{$version}', '{$players}', '{$data}')";
	$result = $conn->query($sql);
	echo "insert success";
} else if ($op == 'get') {
	$name = $_POST['name'];
	$version = $_POST['version'];
	$sql = "SELECT * from `d225003_hexas`.`levels` WHERE `name`='${name}' AND `version`=${version}";
	$result = $conn->query($sql);
	echo $result->fetch_assoc();
}


$sql = "SELECT * FROM levels";
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

