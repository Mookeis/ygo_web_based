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


app.listen(process.env.PORT, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});