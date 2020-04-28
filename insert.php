<?php
session_start();

$DATABASE_HOST = 'localhost';
$DATABASE_USER = 'root';
$DATABASE_PASS = '';
$DATABASE_NAME = 'phplogin';

$con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
if ( mysqli_connect_errno() ) {
	exit('Failed to connect to MySQL: ' . mysqli_connect_error());
}

$deck=$_POST['deck'];
$extra_deck=$_POST['extra_deck'];
$user_id=$_POST['user_id'];
$name=$_POST['name'];

$sql="INSERT INTO decks (user_id, deck, extra_deck, name) VALUES ($user_id, '$deck', '$extra_deck', '$name')";

if($stmt = mysqli_prepare($con, $sql)) {
    $retval = mysqli_stmt_execute($stmt);
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($con);
}

mysqli_close($con);

?>