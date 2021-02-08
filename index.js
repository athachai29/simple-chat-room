const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var random = require('random-name')

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on("set username", (username) => {
        if (username) {
            socket.username = username;
        } else {
            socket.username = random.first();
        }
        io.emit('a user connected', socket.username + ' is connected');
    });

    socket.on('disconnect', () => {
        io.emit('a user disconnected', socket.username + ' is disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', socket.username + ': ' + msg);
    });

    socket.on('typing', () => {
        io.emit('typing');
    });

    socket.on('no-longer-typing', () => {
        io.emit('no-longer-typing');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
