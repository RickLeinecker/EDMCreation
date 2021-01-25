const router = require('express').Router();
let User = require('../models/user.model');
var mongoose = require('mongoose');

router.route('/signup').post((req, res) => {
    const user_id = mongoose.Types.ObjectId();
    const username = req.body.username;

    const newUser = new User({ username });

    newUser.save()
        .then(() => res.json('User registered successfully'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;