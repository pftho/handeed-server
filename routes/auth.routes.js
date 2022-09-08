const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const router = express.Router();
const saltRound = 10;

// SIGNUP - POST
router.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    //check if all fields are completed
    if (username === '' || email === '' || password === '') {
        res.status(400).json({ message: 'All fields are mandatory' });
        return;
    }
    //email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex) {
        res.status(400).json({ message: 'Please enter a valid email' });
    }

    //password check
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex) {
        res.status(400).json({
            message:
                'Please enter a password with at least 6 characters, one number, one lowercase and one uppercase letter.',
        });
        return;
    }

    //user in DB check
    User.findOne({ email })
        .then((foundUserEmail) => {
            if (foundUserEmail) {
                res.status(400).json({
                    message:
                        'You already have an account, please go to the Login page',
                });
                return;
            }
        })
        .then(
            User.findOne({ username })
                .then((foundUsername) => {
                    if (foundUsername) {
                        res.status(400).json({
                            message: 'User name already in use',
                        });
                        return;
                    }

                    //create new user with hashed password
                    const salt = bcrypt.genSaltSync(saltRound);
                    const hashedPassword = bcrypt.hashSync(password, salt);

                    return User.create({
                        username,
                        email,
                        password: hashedPassword,
                    });
                })
                .then((newUser) => {
                    const { email, username, _id } = newUser;
                    const user = { email, username, _id };
                    res.status(200).json({ user: user });
                })
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});

// LOGIN - POST
router.post('/login', (req, res) => {
    const { password, email } = req.body;

    //check if all fields are completed
    if (email === '' || password === '') {
        res.status(400).json({ message: 'All fields are mandatory' });
        return;
    }

    //User in DB check
    User.findOne({ email })
        .then((foundUser) => {
            if (!foundUser) {
                res.status(400).json({
                    message: 'No account found with this email address',
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
                res.status(401).json({ message: 'Unable to authenticate' });
            }
        })
        .catch((err) =>
            res.status(500).json({ message: 'Internal Server Error' })
        );
});

// VERIFY - POST
router.post('/verify', (req, res) => {
    res.status(200).json(req.payload);
});

module.exports = router;
