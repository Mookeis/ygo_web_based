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
    socket.on('drop event', function(target, d) {
        if (document.getElementById(target).getAttribute('data-appendto') === "true") {
            document.getElementById(target).appendChild(document.getElementById(d));
        } else {
            document.getElementById(target).parentNode.appendChild(document.getElementById(d));
        }
    });
}
