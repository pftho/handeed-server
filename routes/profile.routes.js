const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const router = express.Router();
const { isAuthenticated } = require('../middleware/jwt.middleware');
const fileUploader = require('../config/cloudinary.config');

//GET - Display user Info
router.get('/user/:userId', (req, res) => {
    console.log(req.params);
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    User.findById(userId)
        .then(
            ({
                _id,
                username,
                email,
                reviews,
                address,
                credentials,
                imageUrl,
            }) => {
                res.status(200).json({
                    id: _id,
                    username,
                    email,
                    reviews,
                    address,
                    credentials,
                    imageUrl,
                });
            }
        )
        .catch((err) => console.log(err));
});

//POST - Uploads profile image in DB
router.post('/upload', fileUploader.single('imageUrl'), (req, res) => {
    console.log('file is: ', req.file);

    if (!req.file) {
        next(new Error('No file uploaded!'));
        return;
    }

    res.json({ fileUrl: req.file.path });
});

//PUT - Edit user Info
router.put('/user/:userId', (req, res) => {
    const { userId } = req.params;
    const { imageUrl } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    User.findByIdAndUpdate(userId, { imageUrl })
        .then(
            ({ username, email, reviews, address, credentials, imageUrl }) => {
                res.status(200).json({
                    username,
                    email,
                    reviews,
                    address,
                    credentials,
                    imageUrl,
                });
            }
        )
        .catch((err) => console.log(err));
});

module.exports = router;
