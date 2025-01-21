import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
    const server = createServer((req, res) => {
        handle(req, res);
    });

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('message', (data) => {
            console.log('Received message:', data);
            io.emit('message', data);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });

    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
