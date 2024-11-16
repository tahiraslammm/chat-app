import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

let connectedUsers = 0;
io.on('connection', (socket) => {
    connectedUsers++;
    console.log('User connected with id:', socket.id);
    io.emit('userCount', connectedUsers);

    socket.on('disconnect', () => {
        connectedUsers--;
        console.log('User disconnected with id:', socket.id);
        io.emit('userCount', connectedUsers);
    });

    socket.on('message', (message) => {
        console.log('Message received:', message);
        io.emit('message', message);
    })
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})