const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const ObjectID = require('mongodb').ObjectID

const Ad = require('../models/Ad.model');
const User = require('../models/User.model');

const { isAuthenticated, isOwner } = require('../middleware/jwt.middleware');
const fileUploader = require('../config/cloudinary.config');

router.get('/', (req, res) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split('')[1] !== 'null'
    ) {
        Ad.find()
            .populate('owner')
            .then((ads) => res.json(ads))
            .catch((err) => res.json(err));
    } else {
        Ad.find()
            .populate('owner')
            .then((ads) => res.json(ads.slice(0, 9)))
            .catch((err) => res.json(err));
    }
});

router.post(
    '/upload',
    fileUploader.single('image'),
    isAuthenticated,
    (req, res, next) => {
        if (!req.file) {
            next(new Error('No file uploaded!'));
            return;
        }
        res.json({ fileUrl: req.file.path });
    }
);

router.post('/', isAuthenticated, (req, res) => {
    console.log(req.body);
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
    
    console.log(owner);

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
            return User.findByIdAndUpdate(owner, {
                $push: {ads: newAd._id}
            })
        })
        .then((response) => {
            console.log('response', response);
            res.json(response);
        })
        .catch((err) => res.json(err));
});

router.get('/:adId', (req, res) => {
    const { adId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
    Ad.findById(adId)
        .populate('owner')
        .then((ad) => res.status(200).json(ad))
        .catch((error) => res.json(error));
});

router.put('/:adId/edit', isAuthenticated, (req, res) => {
    const { adId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Ad.findByIdAndUpdate(adId, req.body, { new: true })
        .populate('owner')
        .then((ad) => res.status(200).json(ad))
        .catch((error) => res.json(error));
});

router.delete('/:adId', isAuthenticated, (req, res) => {
    const { adId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Ad.findByIdAndRemove(adId)
        .then(() =>
            res.json({
                message: `Ad with ${adId} is removed successfully.`,
            })
        )
        .catch((error) => res.json(error));
});

module.exports = router;
