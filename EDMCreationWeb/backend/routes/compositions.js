const router = require('express').Router();
const Composition = require('../models/compositions.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const JSRSASign = require("jsrsasign");
const auth = require('../middleware/auth');
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
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const fileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'compositions',
        allowed_formats: ['mid', 'midi'],
        resource_type: 'raw'
    },
});

const parser = multer({ storage: fileStorage });

//upload new composition
router.route('/upload').post(auth, parser.single("file"), auth, [
    check('title').isLength({ min: 1 }).withMessage('Title is required'),
    check('genre').isLength({ min: 1 }).withMessage('Genre is required')], (req, res) => {

        //check the results of  the validation
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        const { title, genre } = req.body;
        const path = req.file.path;
        listens = 0; //0 listens
        favorites = 0; // 0 favorites
        comment_count = 0;
        user_id = req.body.ID; //for finding account
        username = req.body.uName;


        const newComp = new Composition({ title, genre, user_id, username, path, listens, favorites, comment_count }); //just drop this line for only user upload?

        User.updateOne({ _id: user_id }, { $push: { "compositions": newComp } })
            .then(() => res.status(200).json({ msg: 'Composition uploaded' }))
            .catch(err => res.status(400).json('Error: ' + err)); //might need to remove uploaded song from database if error occured
    });

// EDIT UPLOAD FOR TRAINING FILE ZIP TO MONGO DB
// router.route('/upload').post(auth, upload.single('file'), auth, (req, res) => {

//     //'file' for field name from front end  
//     //AUTH CALLED TWICE BECAUSE MULTER OCCUPIES REQUESTBODY until after 

//     const { title, description, ID, genre, image_id, uName } = req.body;

//     //if fields are missing, need to add error here for it and remove song that was just uploaded?

//    const file_id = req.file.id; //id from file being stored
//    const filename = req.file.filename;
//    listens = 0; //0 listens
//    favorites = 0; // 0 favorites
//    comment_count = 0;
//    user_id = ID; //for finding accoun
//    username = uName;

//     const newComp = new Composition({ title, description, genre, image_id, user_id, username, file_id, listens, favorites, comment_count, filename });//just drop this line for only user upload?


//     User.updateOne({ _id: ID }, { $push: { "compositions": newComp }, $inc: { upload_count: 1 } })
//         .then(() => res.status(200).json({ msg: 'composition uploaded' }))
//         .catch(err => res.status(400).json('Error: ' + err)); //might need to remove uploaded song from database if error occured

//     //need to redirect on page once done? 
// });

// //single play and update count for when a user hits play on a given song
// router.route('/play/:filename').get((req, res) => {
//     gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//         // Check if file
//         if (!file || file.length === 0) {
//             return res.status(404).json({ err: 'No file exists' });
//         }

//         // File exists

//         // Check if midi then load
//         if (file.contentType === 'audio/mid') {

//         } else {
//             return res.status(404).json({ err: 'Not a MID file' });
//         }
//         const readstream = gfs.createReadStream(file.filename);

//         //update listens for comp and user and send file data
//         User.updateOne({ "compositions.filename": req.params.filename }, { $inc: { "compositions.$.listens": 1, listens_count: 1 } })
//             .then(() => readstream.pipe(res)) //Return File for playing
//             .catch(err => res.status(400).json('Error: ' + err)); //might need to remove uploaded song from database if error occured

//     });
// });

//load multiple composition infos for pages
//REQUIRES PAGE NUMBER IN ROUTE, STARTING ON 1
router.route('/popular').get(async (req, res) => {
    const songsPerPage = 5;
    const skip = songsPerPage * (req.query.page - 1);

    try {
        const songs = await User.aggregate([
            {
                $unwind:
                {
                    path: "$compositions",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $project: {
                    composition_id: "$compositions._id",
                    title: "$compositions.title",
                    username: "$username",
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
            { $sort: { "_id": 1, "listens": -1 } }, //descending values for listens
            { $skip: skip },
            { $limit: songsPerPage }, //skip controls page number and limit controls output
        ]);

        if (!songs) throw Error('No items');

        res.status(200).json(songs);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

//for a given profile and their uploads
router.route('/user/:username').get(async (req, res) => {
    const songsPerPage = 5;
    const skip = songsPerPage * (req.query.page - 1);

    try {
        const items = await User.aggregate([
            { $match: { username: { $regex: new RegExp(req.params.username, "i") } } },
            {
                $unwind:
                {
                    path: "$compositions",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $project: {
                    composition_id: "$compositions._id",
                    title: "$compositions.title",
                    username: "$username",
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
            { $sort: { "_id": -1 } }, //descending values for listens
            { $skip: skip },
            { $limit: songsPerPage }, //skip controls page number and limit controls output
        ]);

        if (!items) throw Error('No items');

        res.status(200).json(items);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

//upload comment for a given song
router.route('/postcomment').post(auth, (req, res) => {
    const comment = req.body.comment;
    const song = req.body.song_id;
    const user_id = req.body.ID;
    var newComment;

    User.findOne({ "_id": user_id })
        .then(user => {
            const username = user.username;
            newComment = new Comment({ username, user_id, comment });
        })
        .then(() => {
            User.updateOne({ "compositions._id": mongoose.Types.ObjectId(song) }, { $push: { "compositions.$.comments": newComment } })
                .then(() => res.status(200).json({ msg: 'Comment uploaded' }))
                .catch(err => res.status(400).json('Error: ' + err));
        });
});


//loads the edit page for a song
router.route('/editinfo').get(auth, (req, res) => {

    //add a check for is the song belongs to the user
    User.findOne({ $and: [{ _id: req.body.ID }, { "compositions": { $elemMatch: { _id: mongoose.Types.ObjectId(req.query.song_id) } } }] })
        .then(async user => {

            if (user) {//if present

                return res.status(200).json(user.compositions.id(req.query.song_id));

            } else {//if not present
                return res.status(400).json({ msg: 'Invalid User or Song' });
                //song doesnot belong to user access denied
            }//end add

        });//end then

});


//saves the edit page for a song
router.route('/editsave').post(auth, [
    check('title').isLength({ min: 1 }).withMessage('Title is required'),
    check('genre').isLength({ min: 1 }).withMessage('Genre is required')], (req, res) => {

        //check the results of  the validation
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        //add a check for is the song belongs to the user
        User.findOne({ $and: [{ _id: req.body.ID }, { "compositions": { $elemMatch: { _id: mongoose.Types.ObjectId(req.body.song_id) } } }] })
            .then(async user => {

                if (user) {//if present
                    user.compositions.id(req.body.song_id).title = req.body.title;
                    user.compositions.id(req.body.song_id).genre = req.body.genre;
                    user.save()
                        .catch(err => res.status(400).json('Error: ' + err));
                    //update the song info
                    return res.status(200).json({ msg: 'Song has been updated' });
                } else {//if not present
                    return res.status(400).json({ msg: 'Invalid user or song' });
                    //song doesnot belong to user access denied
                }//end add

            });//end then

    });


router.route('/incrementplaycount').post((req, res) => {
         
          User.updateOne({ "compositions._id": req.body.song_id }, { $inc: { "compositions.$.listens": 1, listens_count: 1 } })
          .then(() => res.status(200).json('Play count incremented')) 
          .catch(err => res.status(400).json('Error: ' + err)); 

});


//search bar for songs
router.route('/search').get(async (req, res) => {
    const songsPerPage = 5;
    const skip = songsPerPage * (req.query.page - 1);
    const lookup = req.query.search;

    try {
        const songs = await User.aggregate([
            
            {
                $unwind:
                {
                    path: "$compositions",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $match:
                {
                    $or:
                    [
                        {"compositions.username": {$regex: "^" + lookup, '$options': 'i'}},
                        {"compositions.title": {$regex: "^" + lookup, '$options': 'i'}}
                    ]
                }
            },
            {
                $project: {
                    composition_id: "$compositions._id",
                    title: "$compositions.title",
                    username: "$username",
                    num_comments: { $size: "$compositions.comments" },
                    date: "$compositions.last_modified",
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
            { $sort: { "comments.last_modified": -1 } },
            {
                $group: {
                    _id: "$composition_id",
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
            { $sort: { "_id": 1, "listens": -1 } }, //descending values for listens
            { $skip: skip },
            { $limit: songsPerPage }, //skip controls page number and limit controls output
        ]);

        if (!songs) throw Error('No items');

        res.status(200).json(songs);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});


module.exports = router;