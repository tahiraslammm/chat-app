import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';   // Import the fileURLToPath function
import { dirname } from 'path';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

let connectedUsers = 0;
const userMap = new Map();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const chatHistoryFile = path.join(__dirname, 'chatHistory.json');

const readChatHistory = () => {
    try {
        if (fs.existsSync(chatHistoryFile)) {
            const fileContent = fs.readFileSync(chatHistoryFile, 'utf8');
            if (fileContent.trim() === '') {
                return [];
            }
            return JSON.parse(fileContent);
        }
    } catch (error) {
        console.error("Error reading chat history:", error);
    };
}
const chatHistory = readChatHistory();

io.on('connection', (socket) => {
    connectedUsers++;
    console.log('User connected with id:', socket.id);

    socket.emit('userData', {
        connectedUsers,
        socketId: socket.id,
        usersList: Array.from(userMap.values()),
    });

    socket.on('setUsername', (username) => {
        userMap.set(socket.id, username);
        console.log(`Username set for ${socket.id}: ${username}`);
        io.emit('userData', {
            connectedUsers,
            usersList: Array.from(userMap.values()),
        });
    });

    socket.on('disconnect', () => {
        connectedUsers--;
        console.log('User disconnected with id:', socket.id);
        userMap.delete(socket.id);
        io.emit('userData', {
            connectedUsers,
            usersList: Array.from(userMap.values()),
        });
    });

    socket.on('message', (msg) => {
        const senderUsername = userMap.get(socket.id) || 'Anonymous';
        const messageObj = {
            message: msg.message,
            sender: senderUsername,
            socketId: socket.id,
            timestamp: new Date().toISOString(),
        };

        chatHistory.push(messageObj);

        try {
            if (typeof chatHistoryFile === 'string') {
                fs.writeFileSync(chatHistoryFile, JSON.stringify(chatHistory, null, 2));
            } else {
                console.error("Invalid chat history file path:", chatHistoryFile);
            }
        } catch (error) {
            console.error("Error saving chat history:", error);
        }

        io.emit('message', messageObj);
    });

    socket.emit('chatHistory', chatHistory);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
