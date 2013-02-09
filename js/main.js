
var socket = io.connect('(((hostmask)))');
socket.on('element', function (data) {
    $(data.elem).html(data.html);
});
