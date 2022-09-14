// We reuse this import in order to have access to the `body` property in requests
const express = require('express');

// ℹ️ Responsible for the messages you see in the terminal as requests are coming in
// https://www.npmjs.com/package/morgan
const logger = require('morgan');

// ℹ️ Needed when we deal with cookies (we will when dealing with authentication)
// https://www.npmjs.com/package/cookie-parser
const cookieParser = require('cookie-parser');

// ℹ️ Needed to accept from requests from 'the outside'. CORS stands for cross origin resource sharing
// unless the request if from the same domain, by default express wont accept POST requests
const cors = require('cors');

// Middleware configuration
module.exports = (app) => {
    // Because this is a server that will accept requests from outside and it will be hosted ona server with a `proxy`, express needs to know that it should trust that setting.
    // Services like heroku use something called a proxy and you need to add this to your server
    app.set('trust proxy', 1);

    // controls a very specific header to pass headers from the frontend
    app.use(
        cors({
            credentials: true,
            origin: process.env.ORIGIN || 'http://localhost:3001',
        })
    );

    // In development environment the app logs
    app.use(logger('dev'));

    // To have access to `body` property in the request
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    // Handles access to the favicon

    //Handles socket.io
    const http = require('http');
    const server = http.createServer(app);
    const SocketIo = require('socket.io');
    const io = SocketIo(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket) => {
        socket.on('join_room', (data) => {
            //pass the user id in the useEffect line 15 in Chat.js using authcontext
            //chec that I have a chat that matched adid Chat.find({ad}) and that recipient = me or sender = me -> true I have a room -> I want to send messages on the socket
            // create a new even -> sync_messages -> send full list of messages from the chat
            //front side needs to listen and set the chat to listen for it
            socket.join(data);
            console.log(`a user connected: ${socket.id} joined room: ${data}`);
        });

        socket.on('send_message', (data) => {
            console.log(data);
            socket.to(data.room).emit('receive_message', data);
            //send id and user id and know if sender or reciver
            //find the right chat
            // Chat.find() -> push message
        });

        socket.on('disconnect', () => {
            console.log('Disconnected', socket.id);
        });
    });
    server.listen(5006);
};
