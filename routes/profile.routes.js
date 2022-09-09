const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const router = express.Router();
const { isAuthenticated } = require('../middleware/jwt.middleware');

//GET - Display user Info
router.get('/user/:userId', (req, res) => {
    console.log(req.params);
    const { userId } = req.params;
    console.log('userId', userId);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    User.findById(userId).then(
        ({ username, email, reviews, address, credentials, image }) => {
            res.status(200).json({
                username,
                email,
                reviews,
                address,
                credentials,
                image,
            });
        }
    );
});

//PUT - Edit user Info
router.put('/user', (req, res) => {});

//POST - Add user Info
router.post('/upload', (req, res) => {});

module.exports = router;
