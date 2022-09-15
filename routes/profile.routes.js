const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User.model');
const router = express.Router();
const { isAuthenticated } = require('../middleware/jwt.middleware');
const fileUploader = require('../config/cloudinary.config');
const axios = require('axios');

//GET - Display user Info
router.get('/user/:userId', (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    User.findById(userId)
        .populate('ads')
        .then(
            ({
                _id,
                ads,
                username,
                email,
                reviews,
                address,
                credits,
                imageUrl,
            }) => {
                res.status(200).json({
                    ads,
                    id: _id,
                    username,
                    email,
                    reviews,
                    address,
                    credits,
                    imageUrl,
                });
            }
        )
        .catch((err) => console.log(err));
});

//POST - Uploads profile image in DB
router.post('/upload', fileUploader.single('imageUrl'), (req, res, next) => {
    if (!req.file) {
        next(new Error('No file uploaded!'));
        return;
    }

    res.json({ fileUrl: req.file.path });
});

//PUT - Edit user Info
router.put('/user/:userId', (req, res) => {
    const { userId } = req.params;
    const { username, email, reviews, address, credits, imageUrl } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    User.findByIdAndUpdate(userId, {
        username,
        email,
        reviews,
        address,
        credits,
        imageUrl,
    })
        .then(
            ({ username, email, reviews, address, credits, imageUrl, ads }) => {

                res.status(200).json({
                    username,
                    ads,
                    email,
                    reviews,
                    address,
                    credits,
                    imageUrl,
                    ads
                });
            }
        )
        .catch((err) => console.log(err));
});


//get coordinates
const convertAddress = async (address) => {
    const MAPBOX_URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?limit=1&proximity=ip&types=place%2Cpostcode%2Caddress&access_token=${process.env.MAPBOX_TOKEN}`;
    const response = await axios.get(MAPBOX_URL);
    const coordinates = response.data.features[0].center;
    return coordinates;
};

router.get('/location', async (req, res) => {

    const address = req.query.address;
    const coords = await convertAddress(address)

    const lat = coords[1];
    const lng = coords[0]; 
    const radius = req.query.rad ? parseInt(req.query.radius) : 10000;

    if (lat.length === 0 || lng.length === 0) {
        res.send('Wrong parameters');
    }

    const users = await User.find({
        location: {
            $near: {
                $maxDistance: radius,
                $geometry: {
                    type: 'Point',
                    coordinates: [lng, lat],
                },
            },
        },
    }).populate('ads');

    res.json(
        users
    );
});

module.exports = router;
