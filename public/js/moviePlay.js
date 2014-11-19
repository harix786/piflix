$(function () {
    var host = $('body').data('serverhost');
    var id = $('body').data('id');
    var socket = io.connect(host);

    var stopButton = $("#stop");

    socket.emit('play', id);

    socket.on('buffered', function(percentage) {
        if(percentage == 100) {
            $('#buffered').html('Buffering complete, movie should be playing on your screen!');
        } else {
            $('#buffered').html(percentage + '% buffered');
        }
    });

    socket.on('downloaded', function(percentage) {
        $('#downloaded').html(percentage + '% of download completed');
    });

    socket.on('torrent-stopped', function() {
        $('#buffered').html('Torrent stopped');
        $("#downloaded").html('Player stopped');
    });

    socket.on('torrent-completed', function() {
        $("#downloaded").html('Torrent completed & stopped!');
    });

    stopButton.on('click', function() {
        socket.emit('stop-torrent');
    });

});