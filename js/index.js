let express = require('express');
let app = express();
let http = require('http').Server(app);
let path = require('path');
let io = require('socket.io')(http);

app.use(express.static(path.resolve(__dirname + "/../")));

app.get('/', function(req, res){
    res.sendFile(path.resolve(__dirname + '/../index.html'));
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
    socket.on('drop event', function(target, data){
        io.emit('drop event', target, data);
    });
    socket.on('add event', function(attrs, values, name){
        io.emit('add event', attrs, values, name);
    });
});


<<<<<<< HEAD
<<<<<<< HEAD
http.listen(process.env.PORT || 3000, function(){
=======
app.listen(process.env.PORT, function(){
>>>>>>> parent of c28d8fb... Added proc file
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
=======
http.listen(3000, function(){
    console.log('listening on *:3000');
>>>>>>> parent of e98e946... Heroku implementation
});