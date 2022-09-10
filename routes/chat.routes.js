const express = require('express');
const User = require('../models/user.model');
const Chat = require('../models/chat.model');
//Import Ad model
// Ad model will need message array with id comming from message model

const router = express.Router();

router.post('/chat/:id', (req, res) => {
    const { id } = req.params;
    const adToDiscuss = Ad.findById(id).then((response) => {
        const { message } = req.body;
    });

    const newMessage = Chat.create({ sender, recipient, message })
        .then(() => {
            adToDiscuss.messages.push(newMessage._id);
        })
        .then(() => {
            adToDiscuss.save();
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;
