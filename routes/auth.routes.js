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
router.post('/login', (req, res) => {});

// VERIFY - POST
router.post('/verify', (req, res) => {});

module.exports = router;
