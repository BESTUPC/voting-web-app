// All endpoints from the API will be defined here.
const router = require('express').Router();

router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: `Welcome ${req.user.displayName} to RESTHub crafted with love!`
    });
});

module.exports = router;