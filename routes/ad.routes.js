const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Ad = require('../models/Ad.model');
const User = require('../models/User.model');

const { isAuthenticated } = require('../middleware/jwt.middleware');
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
            User.findByIdAndUpdate(
                { _id: owner },
                {
                    $push: { ads: newAd._id },
                }
            ).exec();
            //return newAd;
        })
        .then((newAd) =>
            res.status(201).json({
                message: 'ad has successfully been created',
                // _id: newAd._id,
            })
        )
        .catch(() =>
            res.status(500).json({ message: 'error when creating the ad' })
        );
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

const isOwner = async (req) => {
    const { adId } = req.params;
    const userId = req.payload._id;

    return await Ad.findById(adId).then((ad) => {
        console.log('userId', userId);
        console.log('ad owner', String(ad.owner));
        return String(ad.owner) === userId;
    });
};

router.put('/:adId/edit', isAuthenticated, async (req, res, next) => {
    const { adId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    if (await isOwner(req)) {
        Ad.findByIdAndUpdate(adId, req.body, { new: true })
            .populate('owner')
            .then((ad) => res.status(200).json(ad))
            .catch((error) => res.json(error));
    } else {
        res.redirect(303, '/ads');
    }
});

router.delete('/:adId', isAuthenticated, async (req, res) => {
    const { adId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    if (await isOwner(req)) {
        Ad.findByIdAndRemove(adId)
            .then(() =>
                res.json({
                    message: `Ad with ${adId} is removed successfully.`,
                })
            )
            .catch((error) => res.json(error));
    } else {
        res.redirect(303, '/ads');
    }
});

module.exports = router;
