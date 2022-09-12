const app = require('./app');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 5005;

io.on('connection', (socket) => {
    socket.on('message', ({ username, message }) => {
        io.emit('message', { username, message });
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
