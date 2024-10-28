// server.ts
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import socketIO, { Server as IOServer, Socket } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io: IOServer = new socketIO.Server(server);

  io.on('connection', (socket: Socket) => {
    console.log('New client connected');

    socket.on('sendMessage', (message) => {
      io.emit('newMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  const PORT = parseInt(process.env.PORT || '3000', 10);
  server.listen(PORT, (err?: any) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
