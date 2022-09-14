const express = require('express');
const User = require('../models/User.model');
const Chat = require('../models/Chat.model');
const Ad = require('../models/Ad.model');
const router = express.Router();
const { isAuthenticated } = require('../middleware/jwt.middleware');
const axios = require('axios');

router.post('/contact', isAuthenticated, async (req, res) => {
    try {
        console.log('blu', req.body);
        const { chatname, sender, receiver, ad, messages } = req.body;

        await Chat.create({
            chatname,
            sender,
            receiver,
            ad,
            messages,
        }).then((newChat) => {
            console.log('newChat', newChat);
            res.status(201).json({
                message: 'Chat has successfully been created',
            });
        });
    } catch (err) {
        res.status(500).json({ message: 'error when creating the ad' });
    }
});

// back: GET /adId + token to see what user is connected
//-->  check if chat in db with sender === curent user
//-> if ad is mine, check if recipient id === my id
// if add not mine --> check if sender === me -> return true false chat

router.get('/chat/:adId', async (req, res) => {
    const { adId } = req.params;
    const userId = req.payload._id;

    // const isOwner = async (req) => {
    //     return await Ad.findById(adId).then((ad) => {
    //         console.log('userId', userId);
    //         console.log('ad owner', String(ad.owner));
    //         return String(ad.owner) === userId;
    //     });
    // };

    const senderIsUser = await Chat.find({ sender: userId });
    if (senderIsUser) {
        res.json;
    }
});

module.exports = router;
