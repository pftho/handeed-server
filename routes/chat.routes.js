const express = require('express');
const User = require('../models/User.model');
const Chat = require('../models/User.model');
const router = express.Router();
const { isAuthenticated } = require('../middleware/jwt.middleware');
const axios = require('axios');

//back: POST -> When open chat call backend post create

router.post('/', isAuthenticated, (req, res) => {
    const {
        title,
        description,
        brand,
        size,
        category,
        condition,
        status,
        owner,
        city,
        image,
    } = req.body;

    Ad.create({
        title,
        description,
        brand,
        size,
        category,
        condition,
        status,
        owner: mongoose.Types.ObjectId(owner),
        city,
        image,
    })
        .then((newAd) => {
            console.log('newAd', newAd);
             User.findByIdAndUpdate({_id: owner}, {
                $push: { ads: newAd._id},
            }).exec()
        })
        .then(() => res.status(201).json({ message: 'ad has successfully been created' }))
        .catch(() => res.status(500).json({ message: 'error when creating the ad' }));
});







// back: GET /adId + toekn to see what user is connected -->  check if chat in db with sender === curent user -> if ad is mine, check if recipient id === my id // if add not mine --> check if sender === me -> return true false chat

module.exports = router;
