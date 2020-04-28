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

session_regenerate_id();

if ( !isset($_POST['signup-username'])) {
    $_SESSION['signupusererror'] = TRUE;
}
if( !isset($_POST['signup-password1'])){
    $_SESSION['signuppasserror'] = TRUE;
}
if (!isset($_POST['signup-email'])){
    $_SESSION['signupemailerror'] = TRUE;
}
if (!isset($_POST['signup-password2'])) {
    $_SESSION['signuppasserror'] = TRUE;
}
if(isset($_SESSION['signupusererror']) or isset($_SESSION['signuppasserror']) or isset($_SESSION['signuppasserror']) or isset($_SESSION['signupemailerror'])){
    unset($_SESSION['signupsuccess']);
    header('Location: index.php?');
}


if ($stmt = $con->prepare('SELECT id, password FROM accounts WHERE username = ?')) {
	$stmt->bind_param('s', $_POST['signup-username']);
	$stmt->execute();
    $stmt->store_result();
    echo $stmt->num_rows;
    echo $_POST['signup-username'];
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $password);
        $stmt->fetch();
        $_SESSION['signupusererror'] = TRUE;
        unset($_SESSION['signupsuccess']);
        header('Location: index.php?');
    } else {
        if ($_POST['signup-password1'] != $_POST['signup-password2']){
            $_SESSION['signuppasserror'] = TRUE;
            $_SESSION['signuppasserror'] = TRUE;
            header('Location: index.php?');
        }else{
            $hash = password_hash($_POST['signup-password1'], PASSWORD_DEFAULT);
            if ($stmt = $con->prepare("INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)")) {
                $stmt->bind_param('sss', $_POST['signup-username'], $hash, $_POST['signup-email']);
                if ($stmt->execute()){
                    session_destroy();
                    session_start();
                    session_regenerate_id();
                    $_SESSION['signupsuccess'] = TRUE;
                    header('Location: index.php?');
                }else{
                    unset($_SESSION['signupsuccess']);
                    $_SESSION['signupfailed'] = TRUE;
                    header('Location: index.php?');
                }
            }
        }
    }

	$stmt->close();
}
?>