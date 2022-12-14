const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const router = express.Router();
const saltRound = 10;
const { isAuthenticated } = require('../middleware/jwt.middleware');
const axios = require('axios');

// SIGNUP - POST
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, address } = req.body;
        //check if all fields are completed
        if (
            username === '' ||
            email === '' ||
            password === '' ||
            address === ''
        ) {
            res.status(400).json({ errorMessage: 'All fields are mandatory' });
            return;
        }

        //password check
        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!passwordRegex.test(password)) {
            res.status(400).json({
                errorMessage:
                    'Please enter a password with at least 6 characters, one number, one lowercase and one uppercase letter.',
            });
            return;
        }

        //email check
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                errorMessage: 'Please enter a valid email',
            });
            return;
        }

        //get coordinates
        const convertAddress = async () => {
            const MAPBOX_URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?limit=1&types=place%2Cpostcode%2Caddress&access_token=${process.env.MAPBOX_TOKEN}`;
            const response = await axios.get(MAPBOX_URL);
            const coordinates = response.data.features[0].center;
            return coordinates;
        };

        //user in DB check
        const userByEmail = await User.findOne({ email });
        if (userByEmail) {
            res.status(400).json({
                errorMessage:
                    'You already have an account, please go to the Login page',
            });
            return;
        }

        const userByUsername = await User.findOne({ username });
        if (userByUsername) {
            res.status(400).json({
                errorMessage: 'User name already in use',
            });
            return;
        }

        //create new user with hashed password
        const salt = bcrypt.genSaltSync(saltRound);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const userCreated = {
            username,
            email,
            password: hashedPassword,
            address,
            location: {
                type: 'Point',
                coordinates: await convertAddress(),
            },
        };

        const newUser = await User.create(userCreated);
        res.status(200).json({
            email: newUser.email,
            username: newUser.username,
            _id: newUser._id,
            address: newUser.address,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ errorMessage: 'Internal Server Error' });
    }
});

// LOGIN - POST
router.post('/login', (req, res) => {
    const { password, email } = req.body;

    //check if all fields are completed
    if (email === '' || password === '') {
        res.status(400).json({ errorMessage: 'All fields are mandatory' });
        return;
    }

    //User in DB check
    User.findOne({ email })
        .populate('ads')
        .then((foundUser) => {
            if (!foundUser) {
                res.status(400).json({
                    errorMessage: 'No account found with this email address',
                });
                return;
            }

            // Correct Password Check
            const passwordCorrect = bcrypt.compareSync(
                password,
                foundUser.password
            );

            //Create Sign in Token
            if (passwordCorrect) {
                const { _id, email, username } = foundUser;
                const payload = { _id, email, username };

                const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
                    algorithm: 'HS256',
                    expiresIn: '6h',
                });
                //Send token as response
                res.status(200).json({ authToken: authToken });
            } else {
                res.status(401).json({
                    errorMessage: 'Unable to authenticate',
                });
            }
        })
        .catch((err) =>
            res.status(500).json({ message: 'Internal Server Error' })
        );
});

// VERIFY - POST
router.get('/verify', isAuthenticated, (req, res) => {
    res.status(200).json(req.payload);
});

module.exports = router;
