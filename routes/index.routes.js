const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.json('All good in here, working');
});

router.use('/auth', require('./auth.routes'));
router.use('/chat', require('./chat.routes'));
router.use('/profile', require('./profile.routes'));
router.use('/ads', require('./ad.routes'));

module.exports = router;
