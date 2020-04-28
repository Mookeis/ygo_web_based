<?php 
    session_start();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Yugioh Play Testing</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
    <link href="css/bootstrap-grid.min.css" rel="stylesheet" media="screen">
    <link href="css/bootstrap-reboot.min.css" rel="stylesheet" media="screen">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link href="css/main.css" rel="stylesheet" media="screen">

    <link rel="shortcut icon" href="img/yugioh.ico" type="image/x-icon">

    <script src="https://code.jquery.com/jquery-3.3.1.js"
        integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60=" crossorigin="anonymous"></script>
    <script src="js/popper.min.js"></script>
    <script src="js/parallax-scroll.js"></script>
    <script src="js/underscore-min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script>window.jQuery || document.write('<script src="js/vendor/jquery-3.3.1.js"><\/script>')</script>
    <script src="js/ygopricesapi.js"></script>
    <script type="text/javascript" src="js/chat.js"></script>
    <script src="js/main.js"></script>
</head>

<body onload="setInterval('chat.update()', 1000)">

    <!-- Additional Collapsible info -->
    <div class="pos-f-t">
        <div class="collapse" id="site-description">
            <div class="jumbotron bg-light">
                <h1 class="display-4">Web-based Yugioh App</h1>
                <p class="lead">This is a bootstrap based webapp for hand/play testing decks.</p>
                <hr class="my-4">
                <p>© Mackenzie Dang 2018</p>
                <p class="lead">
                    <a class="btn btn-secondary btn-lg" href="https://github.com/Mookeis/ygo_web_based/tree/master"
                        role="button">GitHub</a>
                </p>
            </div>
        </div>

        <!-- Nav Bar -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <button class="navbar-toggle" data-toggle="collapse" type="button" data-target="#site-description"
                aria-controls="site-description" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="index.php">Home <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Local Deck Options
                        </a>
                        <div class="dropdown-menu bg-dark text-white" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item bg-dark"><input type="file" id="files"></a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item bg-dark text-white" id="load-button" href="#">Load Local File</a>
                            <a class="dropdown-item bg-dark text-white" id="save-button" href="#">Save Local File</a>
                        </div>
                    </li>
                    <?php
                        if(isset($_SESSION['loggedin'])){
                    ?>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Online Decks
                        </a>
                        <div class="dropdown-menu bg-dark text-white" aria-labelledby="navbarDropdown">
                            <?php
                                $DATABASE_HOST = 'localhost';
                                $DATABASE_USER = 'root';
                                $DATABASE_PASS = '';
                                $DATABASE_NAME = 'phplogin';
                                
                                $con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
                                if ( mysqli_connect_errno() ) {
                                    exit('Failed to connect to MySQL: ' . mysqli_connect_error());
                                }
                                
                                if ($stmt = $con->prepare('SELECT * FROM decks WHERE user_id = ?')) {
                                    $stmt->bind_param('i', $_SESSION['id']);
                                    $stmt->execute();
                                    $result = $stmt->get_result();
                                    if ($result->num_rows > 0) {
                                        while($row = $result->fetch_assoc()){
                            ?>
                                            <button class="dropdown-item bg-dark text-white online-deck <?=$row['id']?>">
                                                <input class="deck" type="hidden" value="<?=$row['deck']?>">
                                                <input class="deck" type="hidden" value="<?=$row['extra_deck']?>">
                                                <?=$row['name']?>
                                            </button>
                            <?php
                                        }
                                    }
                                }
                            ?>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"  data-toggle="modal" data-target="#saveOnlineModal" href="#">Save Online</a>
                    </li>
                    <?php
                        }
                    ?>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="modal" data-target="#test-hand-modal" href="#">Test Hands</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="modal" data-target="#chatRoomModal" href="#">Chat</a>
                    </li>
                </ul>
                <ul class="navbar-nav mx-auto">
                    
                </ul>
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <form class="form-inline my-2 my-lg-0">
                            <input class="form-control mr-sm-2" type="search" placeholder="Search a Card"
                                aria-label="Search" id="card-search">
                        </form>
                    </li>
                    <?php
                        if (!isset($_SESSION['loggedin'])){    
                    ?>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="modal" data-target="#modalLRForm" href="#">Login/Signup</a>
                    </li>
                    <?php
                        }else{
                    ?>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle <?=$_SESSION['id']?>" href="#" id="userlogin" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="userlogin">
                            <i class="fa fa-user mr-1"></i> <?=$_SESSION['name']?>
                        </a>
                        <div class="dropdown-menu bg-dark text-white" aria-labelledby="userlogin">
                            <a class="dropdown-item bg-dark text-white" id="logout-button" href="logout.php">Logout</a>
                        </div>
                    </li>
                    <?php
                        }
                    ?>
                </ul>

            </div>
        </nav>
    </div>
    <!-- Chat Modal -->
    <div class="modal fade" id="chatRoomModal" tabindex="-1" role="dialog" aria-labelledby="chatRoomModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="chatRoomModalLabel">Chat:</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="page-wrap">
                    <p class="font-weight-bold" id="name-area">Chatting as: <?php if (isset($_SESSION['name'])){echo $_SESSION['name'];} else{echo "Anon";}?></p>
                    <div id="chat-wrap">
                        <div class="bg-muted rounded" id="chat-area"></div>
                    </div>
                    <form id="send-message-area">
                        <p class="font-weight-bold">Your message: </p>
                        <textarea class="form-control" id="sendie" maxlength = '100' ></textarea>
                    </form>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Save Modal -->
    <div class="modal fade" id="saveOnlineModal" tabindex="-1" role="dialog" aria-labelledby="saveOnlineModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="saveOnlineModalLabel">Enter Deck Title:</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input type="text" name="deck_name" id="deck_name" class="form-control" placeholder="Deck Name">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" id="save-deck" class="btn btn-primary">Save Deck</button>
                </div>
            </div>
        </div>
    </div>

    <!--Modal: Login / Register Form-->
    <div class="modal" id="modalLRForm" tabindex="-1" role="dialog" aria-labelledby="registerlogin"
        aria-hidden="true">
        <div class="modal-dialog cascading-modal" role="document">
            <!--Content-->
            <div class="modal-content">

                <!--Modal cascading tabs-->
                <div class="modal-c-tabs">

                    <!-- Nav tabs -->
                    <ul class="nav nav-tabs md-tabs tabs-2 light-blue darken-3" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" data-toggle="tab" href="#panel7" role="tab"><i
                                    class="fa fa-user mr-1"></i>
                                Login</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-toggle="tab" href="#panel8" role="tab"><i
                                    class="fa fa-user-plus mr-1"></i>
                                Register</a>
                        </li>
                    </ul>

                    <!-- Tab panels -->
                    <div class="tab-content">
                        <!--Panel 7-->
                        <div class="tab-pane fade in show active" id="panel7" role="tabpanel">

                            <!--Body-->
                            <div class="modal-body mb-1">
                                <form action="authenticate.php" method="POST">
                                    <div class="md-form form-sm mb-5">
                                        <i class="fa fa-user prefix"></i>
                                        <input name="login-username" type="text" id="modalLRInput10"
                                            class="form-control form-control-sm validate <?php if(isset($_SESSION['usererror']) or isset($_SESSION['blankerror'])){echo "error";}?>">
                                        <label data-error="wrong" data-success="right" for="modalLRInput10">Your
                                            username</label>
                                    </div>

                                    <div class="md-form form-sm mb-4">
                                        <i class="fa fa-lock prefix"></i>
                                        <input name="login-password" type="password" id="modalLRInput11"
                                            class="form-control form-control-sm validate <?php if(isset($_SESSION['passerror']) or isset($_SESSION['blankerror'])){echo "error";}?>">
                                        <label data-error="wrong" data-success="right" for="modalLRInput11">Your
                                            password</label>
                                    </div>
                                    <div class="text-center mt-2">
                                        <button type="submit" class="btn btn-info">Log in <i class="fa fa-sign-in ml-1"></i></button>
                                    </div>
                                </form>
                            </div>
                            <!--Footer-->
                            <div class="modal-footer">
                                <div class="options text-center text-md-right mt-1">
                                    <p>Forgot <a href="#" class="blue-text">Password?</a></p>
                                </div>
                                <button type="button" class="btn btn-outline-info waves-effect ml-auto"
                                    data-dismiss="modal">Close</button>
                            </div>

                        </div>
                        <!--/.Panel 7-->

                        <!--Panel 8-->
                        <div class="tab-pane fade" id="panel8" role="tabpanel">

                            <!--Body-->
                            <div class="modal-body">
                                <form action="signup.php" method="POST">
                                <div class="md-form form-sm mb-5">
                                    <i class="fa fa-user prefix"></i>
                                    <input name="signup-username" type="text" id="modalLRInput15"
                                        class="form-control form-control-sm validate <?php if(isset($_SESSION['signupusererror'])){echo "error";}?>">
                                    <label data-error="wrong" data-success="right" for="modalLRInput15">Your
                                        username</label>
                                </div>
                                <div class="md-form form-sm mb-5">
                                    <i class="fa fa-envelope prefix"></i>
                                    <input name="signup-email" type="email" id="modalLRInput12"
                                        class="form-control form-control-sm validate <?php if(isset($_SESSION['signupemailerror'])){echo "error";}?>">
                                    <label data-error="wrong" data-success="right" for="modalLRInput12">Your
                                        email</label>
                                </div>

                                <div class="md-form form-sm mb-5">
                                    <i class="fa fa-lock prefix"></i>
                                    <input name="signup-password1" type="password" id="modalLRInput13"
                                        class="form-control form-control-sm validate <?php if(isset($_SESSION['signuppasserror'])){echo "error";}?>">
                                    <label data-error="wrong" data-success="right" for="modalLRInput13">Your
                                        password</label>
                                </div>

                                <div class="md-form form-sm mb-4">
                                    <i class="fa fa-lock prefix"></i>
                                    <input name="signup-password2" type="password" id="modalLRInput14"
                                        class="form-control form-control-sm validate <?php if(isset($_SESSION['signuppasserror'])){echo "error";}?>">
                                    <label data-error="wrong" data-success="right" for="modalLRInput14">Repeat
                                        password</label>
                                </div>

                                <div class="text-center form-sm mt-2">
                                    <button class="btn btn-info">Sign up <i class="fa fa-sign-in ml-1"></i></button>
                                </div>
                                </form>
                            </div>
                            <!--Footer-->
                            <div class="modal-footer">

                                <button type="button" class="btn btn-outline-info waves-effect ml-auto"
                                    data-dismiss="modal">Close</button>
                            </div>
                        </div>
                        <!--/.Panel 8-->
                    </div>

                </div>
            </div>
            <!--/.Content-->
        </div>
    </div>


    <div class="parallax-window">
        <!-- Create Deck Container -->
        <div class="container-fluid">
            <div class="alert alert-danger fade show" role="alert" style="display: none" id="error-container">
                <h4 class="alert-heading">Error!</h4>
                <p>You may only add max 3 copies of any individual card to your deck.</p>
                <button type="button" class="close" onclick="$('.alert').hide()" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="alert alert-danger fade show" role="alert" style="display: none" id="save-error-container">
                <h4 class="alert-heading">Error</h4>
                <p>You must have atleast one card in your deck to save it!</p>
                <button type="button" class="close" onclick="$('.alert').hide()" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <?php
                if(isset($_SESSION['signupfailed'])){
            ?>
            <div class="alert alert-danger fade show" role="alert" id="signup-error-container">
                <h4 class="alert-heading">Error!</h4>
                <p>Signup failed - please try again.</p>
                <button type="button" class="close" onclick="$('.alert').hide()" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <?php
                }
                if(isset($_SESSION['signupsuccess'])){
            ?>
            <div class="alert alert-success fade show" role="alert" id="success-container">
                <h4 class="alert-heading">Signup Successful!</h4>
                <p>You may now login using the login credentials you signed up with.</p>
                <button type="button" class="close" onclick="$('.alert').hide()" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <?php
                }
            ?>
            <br>
            <h3 class="text-secondary">Card List:</h3>
            <div class="row">
                <div class="list-group align-items-center col card-list" id="card-list"></div>
                <div class="col">
                    <h4 class="text-secondary">Monsters: <span class="badge badge-pill badge-info"
                            id="monster-count">0</span>
                    </h4>
                    <div class="list-group deck-lists align-items-center" id="monster-list"></div>
                    <h4 class="text-secondary">Spells: <span class="badge badge-pill badge-info"
                            id="spell-count">0</span></h4>
                    <div class="list-group deck-lists align-items-center" id="spell-list"></div>
                </div>
                <div class="col">
                    <h4 class="text-secondary">Traps: <span class="badge badge-pill badge-info" id="trap-count">0</span>
                    </h4>
                    <div class="list-group deck-lists align-items-center" id="trap-list"></div>
                    <h4 class="text-secondary">Extra: <span class="badge badge-pill badge-info"
                            id="extra-count">0</span></h4>
                    <div class="list-group deck-lists align-items-center" id="extra-list"></div>
                </div>
            </div>
        </div>
        <div class="scroll-down">
            <div class="arrow">
                <img src="img/caret-down.svg" width="23" height="13" alt="" />
            </div>
        </div>
        <br><br>
    </div>
    <div class="parallax-window">
        <!-- Duel Container -->
        <div class="container-fluid">
            <div class="row text-secondary" id="extra-monster-row">
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="field-zone">
                    <h6>Field Spell Zone</h6>
                    <div class="list-group align-items-center zone-item" data-appendto="true">
                    </div>
                </div>
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="em-zone1">
                    <h6>Extra Monster Zone</h6>
                    <div class="list-group align-items-center zone-item" data-appendto="true">
                    </div>
                </div>
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="banish-zone">
                    <h6>Banished</h6>
                    <div class="list-group align-items-center zone-item" data-appendto="true" id="banished">
                    </div>
                </div>
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="em-zone2">
                    <h6>Extra Monster Zone</h6>
                    <div class="list-group align-items-center zone-item" data-appendto="true">
                    </div>
                </div>
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="grave-zone">
                    <h6>Graveyard</h6>
                    <div class="list-group align-items-center zone-item" data-appendto="true" id="graveyard">
                    </div>
                </div>
            </div>
            <div class="row text-secondary" id="monster-row">
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="m-zone1">
                    <h6>Monster Zone</h6>
                    <div class="list-group align-items-center zone-item" data-appendto="true">
                    </div>
                </div>
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="m-zone2">
                    <h6>Monster Zone</h6>
                    <div class="list-group align-items-center zone-item" data-appendto="true">
                    </div>
                </div>
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="m-zone3">
                    <h6>Monster Zone</h6>
                    <div class="list-group align-items-center zone-item" data-appendto="true">
                    </div>
                </div>
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="m-zone4">
                    <h6>Monster Zone</h6>
                    <div class="list-group align-items-center zone-item" data-appendto="true">
                    </div>
                </div>
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="m-zone5">
                    <h6>Monster Zone</h6>
                    <div class="list-group align-items-center zone-item" data-appendto="true">
                    </div>
                </div>
            </div>
            <div class="row text-secondary" id="spell-row">
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="st-zone1">
                    <h6>Spell/Trap Zone</h6>
                    <div class="list-group align-items-center zone-item" data-appendto="true">
                    </div>
                </div>
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="st-zone2">
                    <h6>Spell/Trap Zone</h6>
                    <div class="list-group align-items-center zone-item" data-appendto="true">
                    </div>
                </div>
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="st-zone3">
                    <h6>Spell/Trap Zone</h6>
                    <div class="list-group align-items-center zone-item" data-appendto="true">
                    </div>
                </div>
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="st-zone4">
                    <h6>Spell/Trap Zone</h6>
                    <div class="list-group align-items-center zone-item" data-appendto="true">
                    </div>
                </div>
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="st-zone5">
                    <h6>Spell/Trap Zone</h6>
                    <div class="list-group align-items-center zone-item" data-appendto="true">
                    </div>
                </div>
            </div>
            <div class="row text-secondary" id="hand-deck-row">
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="hand-zone">
                    <h6>
                        Hand
                        <span class="badge badge-primary generate-hand">Generate</span>
                    </h6>
                    <div class="list-group align-items-center" id="hand-zone-list" data-appendto="true"></div>
                </div>
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="deck-zone">
                    <h6>Deck</h6>
                    <div class="list-group align-items-center" id="deck-zone-list" data-appendto="true"></div>
                </div>
                <div class="col zone" ondrop="drop(event)" ondragover="allowDrop(event)" id="extra-deck-zone">
                    <h6>Extra Deck</h6>
                    <div class="list-group align-items-center" id="extra-deck-zone-list" data-appendto="true"></div>
                </div>
            </div>
        </div>
    </div>




    <!-- Modal -->
    <div class="modal fade text-light" id="test-hand-modal" tabindex="-1" role="dialog"
        aria-labelledby="test-hand-modal-label" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content bg-dark">
                <div class="modal-header">
                    <h5 class="modal-title" id="test-hand-modal-label">Generate Test Hands</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body bg-dark">
                    <h5>Hand:</h5>
                    <div class="list-group align-items-left" id="hand-list"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="generate-hand">Generate</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        function allowDrop(allowdropevent) {
            allowdropevent.preventDefault();
        }

        function drag(dragevent) {
            dragevent.dataTransfer.setData("text", dragevent.target.id);
        }

        function drop(dropevent) {
            dropevent.preventDefault();
            let data = dropevent.dataTransfer.getData("text");
            if (dropevent.target.getAttribute('data-appendto') === "true") {
                dropevent.target.appendChild(document.getElementById(data));
            } else {
                dropevent.target.parentNode.appendChild(document.getElementById(data));
            }
        }
        <?php
            if(isset($_SESSION['blankerror']) or isset($_SESSION['usererror']) or isset($_SESSION['passerror'])){
        ?>
            $(document).ready(function() {
                $('#modalLRForm').modal('show');
            });
        <?php
            }
            if(isset($_SESSION['signupusererror']) or isset($_SESSION['signuppasserror']) or isset($_SESSION['signuppasserror']) or isset($_SESSION['signupemailerror'])){
        ?>
            $(document).ready(function() {
                $('#modalLRForm').modal('show');
                $('.nav-tabs a[href="#panel8"]').tab('show');
            });
        <?php
            }
        ?>
    </script>

</body>

</html>