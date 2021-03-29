const router = require('express').Router();
const User = require('../models/user.model');
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const JSRSASign = require("jsrsasign");
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { json } = require('body-parser');
require('dotenv').config();

//sign up 
router.route('/signup').post(
    [
        check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
        check('email').isEmail().withMessage('Email is invalid'),
        check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
        check('confirmationPassword').custom((value, { req }) => (value === req.body.password)).withMessage('Passwords do not match')
    ],
    (req, res) => {
        //check the results of  the validation
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        const { username, email, password } = req.body;

        //check if existing username or email
        User.findOne(
            {
                $or: [
                    { "email": { $regex: new RegExp(email, "i") } },
                    { "username": { $regex: new RegExp(username, "i") } }
                ]
            })
            .then(user => { //$or selects from either elements of array
                if (user) { //if found
                    if (user.email.toLowerCase() === email.toLowerCase()) //triple = for exact match, type and value
                        return res.status(400).json({ msg: "This email has already been registered" });
                    else
                        return res.status(400).json({ msg: "This username has been taken" });
                } else { //no collisions
                    //creating user
                    const listens_count = 0;
                    //const upload_count = 0;
                    const newUser = new User({ username, email, password, listens_count });

                    //hashing password before storing it in database
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) return res.status(400).json('Error: ' + err);
                            newUser.password = hash;
                            newUser.save()
                                .then(() => res.status(200).json('Registration successful!'))
                                .catch(err => res.status(400).json('Error: ' + err));
                        });
                    });

                    //creating web token for registration sign in
                    var day = new Date();
                    var time = day.getTime(); //get time to embed in token 
                    time += 604800000; //7 day expiration

                    const claims = { //assaign payload
                        Username: username,
                        ID: newUser.id, //new user for one just created
                        Expires: time
                    }

                    const key = process.env.JWT_KEY; //signature key
                    const header = { //token description
                        alg: "HS512",
                        typ: "JWT"
                    };

                    var sHeader = JSON.stringify(header);
                    var sPayload = JSON.stringify(claims);

                    const sJWT = JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, key); //token creation

                    res.json({ sJWT, msg: 'Registration Successful!' }); //return token in body for log in
                } //end adding user
            }); //end of user search
    }); //end registration

//login
router.route('/login').post(
    (req, res) => {
        const { username, password } = req.body;

        //creating user
        const oldUser = new User({ username, password });

        User.findOne(
            {
                $or: [
                    { "email": { $regex: new RegExp(username, "i") } },
                    { "username": { $regex: new RegExp(username, "i") } }
                ]
            })
            .then(user => {
                if (user) {//if username found
                    bcrypt.compare(password, user.password).then(isMatch => {
                        if (isMatch) {
                            //creating web token for normal sign in
                            var day = new Date();
                            var time = day.getTime(); //get time to embed in token 
                            time += 604800000; // 7 day expiration

                            const claims = { //assaign payload
                                Username: username,
                                ID: user.id,
                                Expires: time
                            }

                            const key = process.env.JWT_KEY; //signature key
                            const header = { //token description
                                alg: "HS512",
                                typ: "JWT"
                            };

                            var sHeader = JSON.stringify(header);
                            var sPayload = JSON.stringify(claims);

                            const sJWT = JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, key); //token creation

                            res.status(200).json({ sJWT, username: user.username, user_id: user._id, msg: 'Login successful!' }); //return token in body for log in      
                        } else {
                            return res.status(400).json({ msg: "Incorrect ussername and/or password" });
                        } //end password checking
                    }); //exact match
                } //end username match
                else {
                    return res.status(400).json({ msg: "Invalid username and/or password" });
                }
            }); //end user search
    }); //end login



router.route('/info/:username').get((req, res) => {
    User.aggregate(
        [
            { $match: { username: { $regex: new RegExp(req.params.username, "i") } } }, //made case insensitive.
            {
                $project: {
                    username: "$username",
                    description: "$description",
                    listens_count: "$listens_count",
                    upload_count: { $cond: { if: { $isArray: "$compositions" }, then: { $size: "$compositions" }, else: "NA" } }
                },
            }
        ])
        .then(user => {
            res.status(200).json(user[0]);
        })
        .catch(err => {
            return res.status(400).json({ msg: "Error" });
        });
});


//toggle a user favorite for a song
router.route('/liketoggle').post(auth, (req, res) => {

    //composition_id = req.body.song_id;
    //user_id = req.body.ID;

    User.findOne({ $and: [{ _id: req.body.ID }, { "favorites": { $elemMatch: { composition_id: mongoose.Types.ObjectId(req.body.song_id) } } }] })
        .then(user => {

            if (user) {//if present
                //remove

                User.findOneAndUpdate(
                    { _id: req.body.ID },
                    { $pull: { "favorites": { composition_id: mongoose.Types.ObjectId(req.body.song_id) } } },
                    { new: true },
                    function (err) {
                        if (err) { console.log(err) }
                    }
                ).then(res.status(200).json({ msg: 'unfavorited' }));

            } else {//if not present
                //add
                User.updateOne(
                    { _id: req.body.ID },
                    {
                        $push:
                        {
                            favorites:
                                [
                                    {
                                        composition_id: mongoose.Types.ObjectId(req.body.song_id),
                                    }
                                ]
                        }
                    },
                    //{$push: {contacts: {$each: contact.contacts}}},
                    { upsert: true },
                    (err, result) => {
                        if (err) {
                            res.status(400).json('Error: ' + err);
                        } else {
                            res.status(200).json({ msg: 'favorited' });
                        }
                    }
                );
            }//end add

        });//end then


});


//toggle a user favorite for a song
router.route('/followtoggle').post(auth, (req, res) => {

    //composition_id = req.body.song_id;
    //user_id = req.body.ID;

    User.findOne({ $and: [{ _id: req.body.ID }, { "following": { $elemMatch: { user_id: mongoose.Types.ObjectId(req.body.follow_id) } } }] })
        .then(user => {

            if (user) {//if present
                //remove

                User.findOneAndUpdate(
                    { _id: req.body.ID },
                    { $pull: { "following": { user_id: mongoose.Types.ObjectId(req.body.follow_id) } } },
                    { new: true },
                    function (err) {
                        if (err) { console.log(err) }
                    }
                ).then(res.status(200).json({ msg: 'unfollowed' }));

            } else {//if not present
                //add
                User.updateOne(
                    { _id: req.body.ID },
                    {
                        $push:
                        {
                            following:
                                [
                                    {
                                        user_id: mongoose.Types.ObjectId(req.body.follow_id),
                                    }
                                ]
                        }
                    },
                    //{$push: {contacts: {$each: contact.contacts}}},
                    { upsert: true },
                    (err, result) => {
                        if (err) {
                            res.status(400).json('Error: ' + err);
                        } else {
                            res.status(200).json({ msg: 'followed' });
                        }
                    }
                );
            }//end add

        });//end then

});


//returns liked status
router.route('/isliked').get(auth, (req, res) => {
    User.findOne({ $and: [{ _id: req.body.ID }, { "favorites": { $elemMatch: { composition_id: mongoose.Types.ObjectId(req.query.song_id) } } }] })
        .then(user => {
            if (user) {
                res.status(200).json({ liked: true });
            }
            else {
                res.status(200).json({ liked: false });
            }
        });
});


router.route('/getfollow').get(auth, (req, res) => {
    User.findOne({ $and: [{ _id: req.body.ID }, { "following": { $elemMatch: { user_id: mongoose.Types.ObjectId(req.query.user_id) } } }] })
        .then(user => {
            if (user) {
                res.status(200).json({ followed: true });
            }
            else {
                res.status(200).json({ followed: false });
            }
        });
});


//loads the edit page for a user
router.route('/editinfo').get(auth, (req, res) => {
    User.findOne({ _id: req.body.ID })
        .then(user => {
            if (user) {//if user id found
                res.status(200).json({
                    username: user.username,
                    description: user.description,
                    email: user.email,
                }); //return token in body for log in      
            } else {
                return res.status(400).json({ msg: "Invalid username" });
            }
        }); //end user search

});


//saves the edit page 
router.route('/editsave').post(auth, [
    check('email').isEmail().withMessage('Email is invalid'),
    check('newPassword').optional({ checkFalsy: true }).isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
    check('confirmationNewPassword').custom((value, { req }) => {
        if (req.body.newPassword === "") {
            return true;
        } else {
            if (value === req.body.newPassword) {
                return true;
            } else {
                return false;
            }
        }
    }).withMessage('Passwords do not match')],
    (req, res) => {
        //check the results of  the validation
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        //all applicable fields are valid

        if (req.body.newPassword === "") {
            User.findOne({ _id: req.body.ID })
                .then(user => {
                    if (user) {//if user id found
                        user.email = req.body.email;
                        user.description = req.body.description;
                        user.save()
                            .catch(err => res.status(400).json('Error: ' + err));
                    } else {
                        return res.status(400).json({ msg: "Invalid username" });
                    }
                    if (req.body.newPassword === "") {
                        return res.status(200).json('Password and fields updated');
                    }
                }); //end user search
        }
        else {//if password exists
            User.findOne({ _id: req.body.ID })
                .then(user => {
                    if (user) {//if username found
                        bcrypt.compare(req.body.password, user.password).then(isMatch => {
                            if (isMatch) {
                                //save new password but must encrypt
                                //hashing password before storing it in database
                                bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
                                        if (err) return res.status(400).json('Error: ' + err);
                                        user.password = hash;
                                        user.save()
                                            .then(() => res.status(200).json('Password and fields updated'))
                                            .catch(err => res.status(400).json('Error: ' + err));
                                    });
                                });
                            } else {
                                return res.status(400).json({ msg: "Incorrect password" });
                            } //end password checking
                        }); //exact match
                    } //end username match
                    else {
                        return res.status(400).json({ msg: "Invalid User" });
                    }
                }); //end user search
        }//and password update


    });




module.exports = router;