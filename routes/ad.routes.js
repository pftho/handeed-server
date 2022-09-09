const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Ad = require('../models/Ad.model');
const User = require('../models/User.model');

router.get('/list', (req, res) => {
    // if (
    //     req.headers.authorization &&
    //     req.headers.authorization.split('')[1] !== 'null'
    // ) {
        Ad.find()
            //.populate('user')
            .then((ads) => res.json(ads))
            .catch((err) => res.json(err));
    // } else {
    //     Ad.find()
    //         .populate('user')
    //         .then((ads) => res.json(ads.slice(0, 9)))
    //         .catch((err) => res.json(err));
    // }
});

router.post('/list', (req, res) => {
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
        owner,
        city,
        image,
    })
        .then((response) => res.json(response))
        .catch((err) => res.json(err));
});

router.get('/list/:adId', (req, res) => {
    const { adId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Ad.findById(adId)
        //.populate('user')
        .then((ad) => res.status(200).json(ad))
        .catch((error) => res.json(error));
});

router.put('/list/:adId', (req, res) => {
    const { adId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Ad.findByIdAndUpdate(adId)
        //.populate('user')
        .then((ad) => res.status(200).json(ad))
        .catch((error) => res.json(error));
});

router.delete('/list/:adId', (req, res) => {
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
