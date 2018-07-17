$(function () {
    let socket = io();
    $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        let entry = document.createElement('li');
        entry.appendChild(document.createTextNode(msg));
        entry.setAttribute("class", "list-group-item list-group-item-action");
        $('#messages').append(entry);
    });
});