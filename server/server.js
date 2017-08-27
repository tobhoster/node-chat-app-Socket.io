const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3001;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New User Connected');

    // Broadcasted to every user
    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the chat app'
    });

    // socket.broadcast.emit form Admin text new User joined
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app 🔑'));

    socket.on('createMessage', (message) => {
        console.log("createMessage", message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    })

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});