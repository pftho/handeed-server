require('../db/index');
const mongoose = require('mongoose');
const User = require('../models/User.model');

const users = [
    {
        username: 'plr',
        email: 'plr@gmail.com',
        password: 'test',
        ads: [],
        reviews: [],
        messages: [],
        credentials: 3,
        location: {
            type: 'Point',
            coordinates: [2.34181, 48.84681],
        },
    },
    {
        username: 'pft',
        email: 'pft@gmail.com',
        password: 'test',
        ads: [],
        reviews: [],
        messages: [],
        credentials: 3,
        location: {
            type: 'Point',
            coordinates: [2.34189, 48.84689],
        },
    },
];

User.insertMany(users)
    .then((users) => {
        users.forEach((user) => console.log(user.username));
        mongoose.connection.close();
    })
    .catch((saveErr) => console.error(`Save failed: ${saveErr}`));
