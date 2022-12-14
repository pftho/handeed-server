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
const { resourceLimits } = require('worker_threads');

// Middleware configuration
module.exports = (app) => {
    // Because this is a server that will accept requests from outside and it will be hosted ona server with a `proxy`, express needs to know that it should trust that setting.
    // Services like heroku use something called a proxy and you need to add this to your server
    app.set('trust proxy', 1);

    // controls a very specific header to pass headers from the frontend
    app.use(cors());

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
    const Chat = require('../models/Chat.model');
    io.on('connection', (socket) => {
        //listen
        socket.on('join_room', (room) => {
            socket.join(room);
            console.log(`a user connected: ${socket.id} joined room: ${room}`);

            Chat.findById(room).then((foundRoom) => {
                // console.log(foundRoom);
                socket.emit('sync_messages', foundRoom.messages);
            });
            // get in db, chat.findbyid(data), if messages in the chat:
            // create a new even -> sync_messages -> send full list of messages from the chat
            //front side needs to listen and set the chat to listen for it -> il faudra listen pour faire un setchat
        });

        socket.on('send_message', (data) => {
            // console.log(data);
            Chat.findByIdAndUpdate(
                { _id: data.room },
                {
                    $push: { messages: data },
                }
            ).then((chat) => {
                io.in(data.room).emit(
                    'receive_message',
                    chat.messages[chat.messages.length - 1]
                );
            });

            //uodate it to add messages
        });

        socket.on('disconnect', () => {
            console.log('Disconnected', socket.id);
        });
    });
    server.listen(5006);
};
