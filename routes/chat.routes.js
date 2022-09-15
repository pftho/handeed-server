const express = require('express');
const User = require('../models/User.model');
const Chat = require('../models/Chat.model');
const Ad = require('../models/Ad.model');
const router = express.Router();
const { isAuthenticated } = require('../middleware/jwt.middleware');

const isOwner = async (req) => {
    const { adId } = req.params;
    const userId = req.payload._id;

    return await Ad.findById(adId).then((ad) => {
        console.log('userId', userId);
        console.log('ad owner', String(ad.owner));
        return String(ad.owner) === userId;
    });
};

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
        console.log(err);
        res.status(500).json({ message: 'error when creating the chat' });
    }
});

router.get('/:adId', isAuthenticated, async (req, res) => {
    const { adId } = req.params;
    const userId = req.payload._id;

    if (await isOwner(req)) {
        Chat.find({ receiver: userId, ad: adId })
            .populate('sender')
            .populate('receiver')
            .then((ads) => {
                res.status(200).json(ads);
            })
            .catch((error) => res.json(error));
    } else {
        Chat.find({ sender: userId, ad: adId })
            .populate('sender')
            .populate('receiver')
            .then((ads) => {
                console.log('BLUH', ads, userId, adId);
                res.status(200).json(ads);
            })
            .catch((error) => res.json(error));
    }
});

module.exports = router;
