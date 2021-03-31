const router = require('express').Router();
const User = require('../models/user.model');
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const JSRSASign = require("jsrsasign");
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { json } = require('body-parser');
require('dotenv').config();


//for gridfs use
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const { Router } = require('express');
const { rstrtohex } = require('jsrsasign');

//had to put here as well as index so I can use gfs?
const uri = process.env.ATLAS_URI; //for connection //needed even in here
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const connection = mongoose.connection;

let gfs;
connection.once('open', () => {
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {

            crypto.randomBytes(16, (err, buf) => {

                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    metadata: req.body.ID,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const multer = require('multer');
const upload = multer({ storage });

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
        const verified = false;

        //check if existing username or email
        User.findOne(
            {
                $or: [
                    { "email": { $regex: new RegExp('^' + email + '$', "i") } },
                    { "username": { $regex: new RegExp('^' + username + '$', "i") } }
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
                    const newUser = new User({ username, email, password, listens_count, verified });

                    //hashing password before storing it in database
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) return res.status(400).json('Error: ' + err);

                            newUser.password = hash;

                            newUser.save()
                                .then(() => {
                                    const payload = { 'query': { 'email': email } };
                                    sendVerification(payload);

                                    res.status(200).json('Registration successful!')
                                })
                                .catch(err => res.status(400).json('Error: ' + err));
                        });
                    });

                    // //creating web token for registration sign in
                    // var day = new Date();
                    // var time = day.getTime(); //get time to embed in token 
                    // time += 604800000; //7 day expiration

                    // const claims = { //assaign payload
                    //     Username: username,
                    //     ID: newUser.id, //new user for one just created
                    //     Expires: time
                    // }

                    // const key = process.env.JWT_KEY; //signature key
                    // const header = { //token description
                    //     alg: "HS512",
                    //     typ: "JWT"
                    // };

                    // var sHeader = JSON.stringify(header);
                    // var sPayload = JSON.stringify(claims);

                    // const sJWT = JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, key); //token creation

                    // res.json({ sJWT, msg: 'Registration Successful!' }); //return token in body for log in
                } //end adding user
            })
            .catch(err => {
                res.status(400).json({ msg: err });
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
                    { "email": { $regex: new RegExp('^' + username + '$', "i") } },
                    { "username": { $regex: new RegExp('^' + username + '$', "i") } }
                ]
            })
            .then(user => {
                if (user) {//if username found
                    bcrypt.compare(password, user.password).then(isMatch => {
                        if (isMatch) {
                            if (user.verified === false) {
                                const link = process.env.URL + "sendverification?email=" + user.email;
                               return res.status(400).json(
                                    {
                                        msg: "Please verify your email. Click <a href=" +
                                            link + " style=\"color: #BDBDBD\">here</a> to resend verification link."
                                    }
                                );
                            }

                            //creating web token for normal sign in
                            var day = new Date();
                            var time = day.getTime(); //get time to embed in token 
                            time += 604800000; // 7 day expiration

                            const claims = { //assaign payload
                                Username: user.username,
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
                            return res.status(400).json({ msg: "Incorrect username and/or password" });
                        } //end password checking
                    }); //exact match
                } //end username match
                else {
                    return res.status(400).json({ msg: "Invalid username and/or password" });
                }
            })
            .catch(err => {
                res.status(400).json({ msg: err });
            }); //end user search
    }); //end login



router.route('/info/:username').get((req, res) => {
    User.aggregate(
        [
            { $match: { username: { $regex: new RegExp('^' + req.params.username + '$', "i") } } }, //made case insensitive.
            {
                $project: {
                    username: "$username",
                    description: "$description",
                    listens_count: { $sum: "$compositions.listens" },
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
                                        create_on: new Date().toISOString()
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

        })
        .catch(err => {
            res.status(400).json({ msg: err });
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
                ).then(res.status(200).json({ msg: 'Unfollowed' }));

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
                                        create_on: new Date().toISOString()
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
                            res.status(200).json({ msg: 'Followed' });
                        }
                    }
                );
            }//end add

        })
        .catch(err => {
            res.status(400).json({ msg: err });
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
        })
        .catch(err => {
            res.status(400).json({ msg: err });
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
        })
        .catch(err => {
            res.status(400).json({ msg: err });
        });
});


//loads the edit page for a user
router.route('/editinfo').get(auth, (req, res) => {
    User.findOne({ _id: req.body.ID })
        .then(user => {
            if (user) {//if user id found
                res.status(200).json(
                    {
                        username: user.username,
                        description: user.description,
                        email: user.email,
                    }
                );
            } else {
                return res.status(400).json({ msg: "Invalid username" });
            }
        })
        .catch(err => {
            res.status(400).json({ msg: err });
        }); //end user search

});


//saves the edit page 
router.route('/editsave').post(auth,
    [
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
        })
            .withMessage('Passwords do not match')
    ],
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        User.findOne({ _id: req.body.ID })
            .then(user => {
                if (user) {
                    user.description = req.body.description;

                    if (user.email !== req.body.email) {
                        user.new_email = req.body.email;
                        user.update_verified = false;
                    }

                    if (req.body.newPassword !== "") {
                        const match = bcrypt.compareSync(req.body.password, user.password);

                        if (match) {
                            const hash = bcrypt.hashSync(req.body.newPassword, 10);
                            user.password = hash;
                        } else {
                            return res.status(400).json({ msg: "Incorrect password" });
                        }
                    }

                    user.save()
                        .then(() => {
                            if (user.email !== req.body.email) {
                                const payload = { 'query': { 'email': req.body.email } };
                                sendVerification(payload);
                            }

                            res.status(200).json({ msg: "Profile has been updated" })
                        })
                        .catch(err => res.status(400).json('Error: ' + err));
                } else {
                    return res.status(400).json({ msg: "Invalid username" });
                }
                if (req.body.newPassword === "") {
                    return res.status(200).json('Password and fields updated');
                }
            })
            .catch(err => {
                res.status(400).json({ msg: err });
            });
    }
);

//load a users favorited/liked songs to be displayed
router.route('/favorites').get(async (req, res) => {
    const songsPerPage = 5;
    const skip = songsPerPage * (req.query.page - 1);

    try {
        const songs = await User.aggregate([
            { $match: { username: { $regex: new RegExp('^' + req.query.username + '$', "i") } } },
            {
                $unwind:
                {
                    path: "$favorites",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $project: {
                    composition_id: "$favorites.composition_id",
                    favorited_date: "$favorites.created_on"
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "composition_id",
                    foreignField: "compositions._id",
                    as: "favorites",
                }
            },
            {
                $project: {
                    composition_id: 1,
                    favorited_date: 1,
                    favorites: "$favorites.compositions",

                },
            },
            {
                $unwind:
                {
                    path: "$favorites",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $unwind:
                {
                    path: "$favorites",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $project: {
                    composition_id: 1,
                    favorited_date: 1,
                    favorites: 1,
                    match: { $eq: ["$composition_id", "$favorites._id"] }
                },
            },
            { $match: { match: true } },
            {
                $project: {
                    favorited_date: 1,
                    compositions: "$favorites",
                },
            },
            {
                $project: {
                    favorited_date: 1,
                    composition_id: "$compositions._id",
                    title: "$compositions.title",
                    username: "$compositions.username",
                    num_comments: { $size: "$compositions.comments" },
                    date: "$compositions.created_on",
                    comments: "$compositions.comments",
                    genre: "$compositions.genre",
                    path: "$compositions.path",
                    listens: "$compositions.listens"
                },
            },
            {
                $unwind:
                {
                    path: "$comments",
                    preserveNullAndEmptyArrays: true
                }
            },
            { $sort: { "comments.created_on": -1 } },
            {
                $group: {
                    _id: "$composition_id",
                    favorited_date: { $first: "$favorited_date" },
                    composition_id: { $first: "$composition_id" },
                    user_id: { $first: "$_id" },
                    title: { $first: "$title" },
                    username: { $first: "$username" },
                    num_comments: { $first: "$num_comments" },
                    date: { $first: "$date" },
                    comments: { $push: "$comments" },
                    genre: { $first: "$genre" },
                    path: { $first: "$path" },
                    listens: { $first: "$listens" },
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "favorites.composition_id",
                    as: "favorites",
                }
            },
            {
                $project: {
                    composition_id: 1,
                    favorited_date: 1,
                    user_id: 1,
                    title: 1,
                    username: 1,
                    num_comments: 1,
                    date: 1,
                    comments: 1,
                    genre: 1,
                    path: 1,
                    listens: 1,
                    likes: { $size: "$favorites" }
                }
            },
            { $sort: { "favorited_date": -1 } },
            { $skip: skip },
            { $limit: songsPerPage },
        ]);

        if (!songs) throw Error('No songs');
       
        const lastPage = songs.length<5;
        
        res.status(200).json({songs,lastPage});
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});


router.route('/following').get(async (req, res) => {
    const usersPerPage = 5;
    const skip = usersPerPage * (req.query.page - 1);

    try {
        const users = await User.aggregate([
            { $match: { username: { $regex: new RegExp('^' + req.query.username + '$', "i") } } },
            {
                $unwind:
                {
                    path: "$following",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $project: {
                    user_id: "$following.user_id",
                    followed_date: "$following.created_on"
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "users",
                }
            },
            {
                $unwind:
                {
                    path: "$users",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $project: {
                    user_id: 1,
                    followed_date: 1,
                    username: "$users.username",
                    description: "$users.description",
                },
            },
            { $sort: { "followed_date": -1 } },
            { $skip: skip },
            { $limit: usersPerPage },
        ]);

        if (!users) throw Error('No songs');

        res.status(200).json(users);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

// Email verification
const nodemailer = require("nodemailer");
const mailUsername = process.env['MAIL_USERNAME'];
const mailPassword = process.env['MAIL_PASSWORD'];
const verificationKey = process.env['EMAIL_VERIFIER_JWT_KEY'];

const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: mailUsername,
        pass: mailPassword
    }
});

const sendVerification = (req, res) => {
    User.findOne({
        $or: [
            { email: { $regex: new RegExp('^' + req.query.email + '$', "i") } },
            { new_email: { $regex: new RegExp('^' + req.query.email + '$', "i") } },
        ]
    })
        .then(user => {
            if (!user)
                res.status(400).json({ msg: "Error" });

            if (user.verified === true && user.update_verified !== false)
                res.status(400).json({ msg: 'Email already verified or not registered' })

            var day = new Date();
            var time = day.getTime();
            time += 604800000;

            var email;

            if (user.verified !== true) {
                email = user.email
            }
            else if (user.update_verified === false) {
                email = user.new_email
            }
            else {
                res.status(400).json({ msg: "Error" });
            }

            const claims = {
                email: email
            }

            const header = {
                alg: "HS512",
                typ: "JWT"
            };

            var sHeader = JSON.stringify(header);
            var sPayload = JSON.stringify(claims);

            const sJWT = JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, verificationKey);

            const link = process.env.URL + "verify?token=" + sJWT;

            const mailOptions = {
                'to': email,
                'subject': "EDM Creation: Verify your email address",
                'html': "Hello "+user.username+",<br><br>Please click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
            }

            smtpTransport.sendMail(mailOptions, (error, transportRes) => {
                if (error) {
                    res.status(400).json({ 'msg': error.toString() });
                }
                else {
                    res.status(200).json({ 'msg': 'Verification request email sent' });
                }
            });
        })
        .catch(err => {
            res.status(400).json({ msg: err });
        });
};

router.route('/sendverification').get(sendVerification);

router.route('/verify').get((req, res) => {
    const token = req.query.token;

    if (!JSRSASign.jws.JWS.verifyJWT(token, verificationKey, { alg: ["HS512"] })) {
        return res.status(401).json({ msg: 'Invalid token provided' });
    }

    const jWS = token;
    const jWT = jWS.split(".");
    const uClaim = JSRSASign.b64utos(jWT[1]);
    const pClaim = JSRSASign.jws.JWS.readSafeJSONString(uClaim);

    const email = pClaim.email;

    User.findOne({
        $or: [
            { email: { $regex: new RegExp('^' + email + '$', "i") } },
            { new_email: { $regex: new RegExp('^' + email + '$', "i") } },
        ]
    })
        .then(user => {
            if (!user)
                res.status(400).json({ msg: "Error" });

            if (user.verified === true && user.update_verified === false) {
                User.updateOne(
                    {
                        _id: user._id,
                        new_email: { $ne: null }
                    },
                    {
                        $set: {

                            email: user.new_email,
                            update_verified: true

                        },
                        $unset: {
                            new_email: 1
                        }
                    }
                )
                    .then(result => {
                        res.status(200).json({ msg: "Success", type: "Update" });
                    })
                    .catch(err => {
                        res.status(200).json({ msg: "Error" });
                    });
            }
            else if (user.verified === false) {
                User.updateOne({ _id: user._id }, { verified: true })
                    .then(result => {
                        res.status(200).json({ msg: "Success", type: "Register" });
                    })
                    .catch(err => {
                        res.status(200).json({ msg: "Error" });
                    });
            }
            else {
                res.status(400).json({ msg: 'Email already verified' })
            }
        })
        .catch(err => {
            res.status(400).json({ msg: err });
        });
});

// Password reset
const resetKey = process.env['PASSWORD_RESET_JWT_KEY'];

resetPasswordRequest = (req, res) => {
    User.findOne({
        email: { $regex: new RegExp('^' + req.query.email + '$', "i") },
    })
        .then(user => {
            if (!user)
                res.status(400).json({ msg: "Error" });

            const claims = {
                email: user.email
            }

            const header = {
                alg: "HS512",
                typ: "JWT"
            };

            var sHeader = JSON.stringify(header);
            var sPayload = JSON.stringify(claims);

            const sJWT = JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, resetKey);

            const link = process.env.URL + "resetpassword?email=" + user.email + "&token=" + sJWT;

            const mailOptions = {
                'to': user.email,
                'subject': "EDM Creation: Reset your password",
                'html': "Hello,<br><br>Please click on the link to reset your password.<br><a href=" + link + ">Click here to reset password</a>"
            }

            smtpTransport.sendMail(mailOptions, (error, transportres) => {
                if (error) {
                    res.status(400).json({ 'msg': error.toString() });
                }
                else {
                    res.status(200).json({ 'msg': 'Reset password request sent' });
                }
            });
        })
        .catch(err => {
            res.status(400).json({ msg: err });
        });
};

router.route('/resetpassword').get(resetPasswordRequest);

router.route('/changepassword').post(
    [
        check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
        check('confirmationPassword').custom((value, { req }) => (value === req.body.password)).withMessage('Passwords do not match')
    ],
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        const token = req.query.token;

        if (!JSRSASign.jws.JWS.verifyJWT(token, resetKey, { alg: ["HS512"] })) {
            return res.status(401).json({ msg: 'Invalid token provided' });
        }

        const jWS = token;
        const jWT = jWS.split(".");
        const uClaim = JSRSASign.b64utos(jWT[1]);
        const pClaim = JSRSASign.jws.JWS.readSafeJSONString(uClaim);

        const email = pClaim.email;

        User.findOne({
            email: { $regex: new RegExp('^' + email + '$', "i") },
        })
            .then(user => {
                if (!user)
                    res.status(400).json({ msg: "Error" });

                const newPassword = bcrypt.hashSync(req.body.password, 10);

                User.updateOne(
                    {
                        _id: user._id,
                    },
                    {
                        $set: {
                            password: newPassword,
                        },
                    }
                )
                    .then(result => {
                        res.status(200).json({ msg: "Success" });
                    })
                    .catch(err => {
                        res.status(200).json({ msg: "Error" });
                    });
            })
            .catch(err => {
                res.status(400).json({ msg: err });
            });
    }
);


// EDIT UPLOAD FOR TRAINING FILE ZIP TO MONGO DB
router.route('/trainingupload').post(auth, upload.single('file'), auth, (req, res) => {

    //NEED TO DELETE OLD TRAINING IF IT EXISTS
    User.findOne({ _id: req.body.ID })
        .then(user=>{ 
            if(user.training_file_id){//if not empty
                gfs.remove({ _id: user.training_file_id, root: 'uploads' }, (err) => {
                    if (err) {
                    return res.status(404).json({ err: err });
                    }
                });
            }
        })
        .catch(err => {
            res.status(400).json({ msg: err });
        });

    User.updateOne({ _id: req.body.ID }, { $set: { "training_file_id": req.file.id }})
        .then(() => res.status(200).json({ msg: 'training uploaded' }))
        .catch(err => res.status(400).json('Error: ' + err)); //might need to remove uploaded song from database if error occured

    //need to redirect on page once done? 
});


// //modify for get training
// //single play and update count for when a user hits play on a given song
router.route('/trainingdownload').get(auth,(req, res) => {
    
    User.findOne({_id : req.body.ID})
        .then(user=>{ 
            
            if(user){
                
                gfs.files.findOne({ _id: user.training_file_id }, (err, file) => {
                    // Check if file
                    if (!file || file.length === 0) {
                        return res.status(404).json({ err: 'No file exists' });
                    }
            
                    const readstream = gfs.createReadStream(file.filename);
                    return readstream.pipe(res); //front end saves?
                     //res.status(200).json( "Training returned" );
                

                });
            }else{
                //error retrieving user
            }
            
        }).catch(err => {
            res.status(400).json({ msg: err });
        });
    
   
});


module.exports = router;