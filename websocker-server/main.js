// websocket-server.js

const WebSocket = require('ws');
const http = require('http');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');

// Configs
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const redisPub = new Redis({
    host: process.env.REDIS_HOST || 'localhost',  // Use REDIS_HOST from env or fallback to 'localhost'
    port: 6379,  // Default Redis port
    // password: process.env.REDIS_PASSWORD,  // Optional: Use this if you set a password
}); // pub/sub instance
const redisSub = new Redis({
    host: process.env.REDIS_HOST || 'localhost',  // Use REDIS_HOST from env or fallback to 'localhost'
    port: 6379,  // Default Redis port
    // password: process.env.REDIS_PASSWORD,  // Optional: Use this if you set a password
}); // pub/sub instance
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Store active clients
const clients = new Map();

// Handle connection
wss.on('connection', (ws, req) => {
    const token = new URLSearchParams(req.url.replace('/?', '')).get('token');

    if (!token) return ws.close(4001, 'Token missing');

    let user;
    try {
        user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return ws.close(4002, 'Invalid token');
    }

    const userId = user.id;
    clients.set(ws, userId);
    console.log(`User ${userId} connected`);

    ws.on('message', (msg) => {
        let data;
        try {
            data = JSON.parse(msg);
        } catch (e) {
            return ws.send(JSON.stringify({ error: 'Invalid JSON' }));
        }

        if (data.type === 'chat') {
            const payload = {
                from: userId,
                message: data.message,
                room: data.room || 'global',
            };
            redisPub.publish(`room:${payload.room}`, JSON.stringify(payload));
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log(`User ${userId} disconnected`);
    });
});

// Redis subscription
redisPub.psubscribe('room:*');
redisSub.on('pmessage', (pattern, channel, message) => {
    const room = channel.split(':')[1];
    const data = JSON.parse(message);

    for (const [client, uid] of clients.entries()) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ room, ...data }));
        }
    }
});

// Start server
server.listen(PORT, () => {
    console.log(`WebSocket server listening on port ${PORT}`);
});
