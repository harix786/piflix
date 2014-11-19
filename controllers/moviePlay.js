var movieService = require('../service/movieService'),
    playerService = require('../service/playerService'),
    movieSubtitleService = require('../service/movieSubtitleService'),
    fileSystemService = require('../service/fileSystemService');

module.exports = function (app, socketio) {

    app.get('/movie/play/:id', function (req, res) {
        var id = req.params.id;
        var host = 'http://' + req.headers.host.split(':')[0];
        res.render('moviePlay', {
            "id": id,
            "host": host
        });
    });

    socketio.sockets.on('connection', function (socket) {
        socket.on('play', function (id) {
            fileSystemService.clearTempFolder(function() {
                movieService.fetchDetails(id, function (response) {
                    // TODO remove the timeout
                    setTimeout(movieSubtitleService.getPathToSubtitles(response.imdbCode, function (subtitlePath) {
                        playerService.playMagnet(response.magnetUrl, subtitlePath);
                    }), 2000);
                });
            });
        });

        socket.on('stop-torrent', function () {
            playerService.stopTorrent('torrent-stopped');
        });

        playerService.eventEmitter.on('buffered', function (percentage) {
            socketio.emit('buffered', percentage);
        });

        playerService.eventEmitter.on('downloaded', function (percentage) {
            socketio.emit('downloaded', percentage);
        });

        playerService.eventEmitter.on('torrent-stopped', function () {
            socketio.emit('torrent-stopped');
        });

        playerService.eventEmitter.on('torrent-completed', function () {
            socketio.emit('torrent-completed');
        });
    });

};