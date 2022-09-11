const { expressjwt: jwt } = require('express-jwt');

function getTokenFromHeaders(req) {
    //verify if token and if it starts with "Bearer" -> if yes, then get the token
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        const token = req.headers.authorization.split(' ')[1];
        return token;
    }
    return null;
}

// Instantiate the JWT Token
const isAuthenticated = jwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'payload',
    getToken: getTokenFromHeaders,
});

const isOwner = (req, res, next) => {
    if (!req.session.currentUser._id === req.params.adId) {
        res.redirect('/ads');
    }
    next();
};

module.exports = {
    isAuthenticated,
    isOwner,
};
