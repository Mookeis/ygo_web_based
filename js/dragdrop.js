let socket = io();

function allowDrop(allowdropevent) {
    allowdropevent.preventDefault();
}

function drag(dragevent) {
    dragevent.dataTransfer.setData("text", dragevent.target.id);
}

function drop(dropevent) {
    dropevent.preventDefault();
    let data = dropevent.dataTransfer.getData("text");
    socket.emit('drop event', dropevent.target.getAttribute('id'), data);
}
