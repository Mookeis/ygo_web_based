<?php
session_start();

$DATABASE_HOST = 'us-cdbr-iron-east-01.cleardb.net';
$DATABASE_USER = 'b1c6aa7e68c2a0';
$DATABASE_PASS = 'a248a5e5';
$DATABASE_NAME = 'heroku_225f13460926939';

$con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
if ( mysqli_connect_errno() ) {
	exit('Failed to connect to MySQL: ' . mysqli_connect_error());
}

if ( !isset($_POST['login-username'], $_POST['login-password']) or empty($_POST['login-username']) or empty($_POST['login-password'])) {
    $_SESSION['blankerror'] = TRUE;
    header('Location: index.php?');
}
if ($stmt = $con->prepare('SELECT id, password FROM accounts WHERE username = ?')) {
	$stmt->bind_param('s', $_POST['login-username']);
	$stmt->execute();
	$stmt->store_result();
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $password);
        $stmt->fetch();
        if (password_verify($_POST['login-password'], $password)) {
            //session_destroy();
            //session_start();
            //session_regenerate_id();
            unset($_SESSION['blankerror']);
            unset($_SESSION['passerror']);
            unset($_SESSION['usererror']);
            $_SESSION['loggedin'] = TRUE;
            $_SESSION['name'] = $_POST['login-username'];
            $_SESSION['id'] = $id;
            header('Location: index.php');
        } else {
            $_SESSION['passerror'] = TRUE;
            header('Location: index.php');
        }
    } else {
        $_SESSION['usererror'] = TRUE;
        header('Location: index.php');
    }

	$stmt->close();
}
?>