const { expressjwt: jwt } = require('express-jwt');

function getTokenFromHeaders(req) {
    //verify if token and if it starts with "Bearer" -> if yes, then get the token
    if (
        req.headers.autorization &&
        req.headers.autorization.split(' ')[0] === 'Bearer'
    ) {
        const token = req.headers.autorization.split(' ')[1];
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

module.exports = {
    isAuthenticated,
};
