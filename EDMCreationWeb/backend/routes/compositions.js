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

        var { title, genre } = req.body;
        const path = req.file.path;
        listens = 0; //0 listens
        favorites = 0; // 0 favorites
        comment_count = 0;
        user_id = req.body.ID; //for finding account
        username = req.body.uName;

        if (genre === "") {
            genre = "Other";
        }

        const newComp = new Composition({ title, username, genre, path, listens }); //just drop this line for only user upload?

        User.updateOne({ _id: user_id }, { $push: { "compositions": newComp } })
            .then(() => res.status(200).json({ msg: 'Composition uploaded' }))
            .catch(err => res.status(400).json('Error: ' + err)); //might need to remove uploaded song from database if error occured
    });



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
            { $sort: { "listens": -1, "_id": 1 } }, //descending values for listens
            { $skip: skip },
            { $limit: songsPerPage }, //skip controls page number and limit controls output
        ]);

        if (!songs) throw Error('No songs');

        const lastPage = songs.length < 5;

        res.status(200).json({ songs, lastPage });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

//for a given profile and their uploads
router.route('/user/:username').get(async (req, res) => {
    const songsPerPage = 5;
    const skip = songsPerPage * (req.query.page - 1);

    try {
        const songs = await User.aggregate([
            { $match: { username: { $regex: new RegExp('^' + req.params.username + '$', "i") } } },
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
            { $sort: { "_id": -1 } },
            { $skip: skip },
            { $limit: songsPerPage },
        ]);

        if (!songs) throw Error('No songs');
        const lastPage = songs.length < 5;

        res.status(200).json({ songs, lastPage });
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
        .catch(err => {
            res.status(400).json({ msg: err });
        })
        .then(() => {
            User.updateOne({ "compositions._id": mongoose.Types.ObjectId(song) }, { $push: { "compositions.$.comments": newComment } })
                .then(() => res.status(200).json({ msg: 'Comment uploaded' }))
                .catch(err => res.status(400).json('Error: ' + err));
        });
});


//loads the edit page for a song
router.route('/editinfo').get(auth, async (req, res) => {
    try {
        const song = await User.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(req.body.ID) } },
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
            { $match: { composition_id: mongoose.Types.ObjectId(req.query.song_id) } },
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
        ]);

        if (song) {
            return res.status(200).json(song);
        } else {
            return res.status(400).json({ msg: 'Invalid User or Song' });
        }
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }

});


//saves the edit page for a song
router.route('/editsave').post(auth,
    [
        check('title').isLength({ min: 1 }).withMessage('Title is required'),
        check('genre').isLength({ min: 1 }).withMessage('Genre is required')
    ],
    (req, res) => {

        //check the results of  the validation
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        //add a check for is the song belongs to the user
        User.findOne({ $and: [{ _id: req.body.ID }, { "compositions": { $elemMatch: { _id: mongoose.Types.ObjectId(req.body.song_id) } } }] })
            .then(async user => {
                if (req.body.genre === "") {
                    req.body.genre = "Other";
                }

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

            })
            .catch(err => {
                res.status(400).json({ msg: err });
            });//end then

    }
);


router.route('/delete').post(auth, (req, res) => {
    User.aggregate(
        [
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.body.ID)
                }
            },
            {
                $unwind: "$compositions"
            },
            {
                $match: {
                    "compositions._id": mongoose.Types.ObjectId(req.body.song_id)
                }
            },
            {
                $project: {
                    path: "$compositions.path"
                }
            }
        ])
        .then(result => {
            const path = result[0].path.split("/");
            const publicId = path[path.length - 2] + "/" + path[path.length - 1];

            cloudinary.uploader.destroy(
                publicId,
                { invalidate: true, resource_type: "raw" },
                cloudinaryRes => res.send(cloudinaryRes)
            );

            User.updateOne(
                { _id: req.body.ID },
                {
                    $pull: {
                        compositions: {
                            _id: req.body.song_id
                        }
                    }
                }
            )
                .then(result => {
                    res.status(200).json({ msg: "Success" });
                })
        })
        .catch(err => {
            res.status(200).json({ msg: "Error" });
        });
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
                        [//partial hit search all categories
                            { "compositions.username": { $regex: ".*" + lookup + ".*", '$options': 'i' } },
                            { "compositions.genre": { $regex: ".*" + lookup + ".*", '$options': 'i' } },
                            { "compositions.title": { $regex: ".*" + lookup + ".*", '$options': 'i' } }
                        ]
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

            { $sort: { "listens": -1, "_id": 1 } }, //descending values for listens
            { $skip: skip },
            { $limit: songsPerPage }, //skip controls page number and limit controls output

        ]);

        if (!songs) throw Error('No songs');

        const lastPage = songs.length < 5;

        res.status(200).json({ songs, lastPage });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

//random kinda works but isnt cached so paging isnt right.
router.route('/random').get(async (req, res) => {
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
                    likes: { $size: "$favorites" },
                    rand: { $multiply: [{ $rand: {} }, 12345] }
                }
            },
            { $sort: { "rand": -1 } }, //descending values for listens
            { $skip: skip },
            { $limit: songsPerPage }, //skip controls page number and limit controls output
        ]);

        if (!songs) throw Error('No songs');

        res.status(200).json(songs);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});


//genre search for songs
router.route('/genre').get(async (req, res) => {
    const songsPerPage = 5;
    const skip = songsPerPage * (req.query.page - 1);
    const genre = req.query.genre;

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
                $match: { "compositions.genre": { $regex: "^" + genre, '$options': 'i' } }
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
            { $sort: { "likes": -1, "_id": 1 } }, //descending values for likes
            { $skip: skip },
            { $limit: songsPerPage }, //skip controls page number and limit controls output
        ]);

        if (!songs) throw Error('No songs');

        const lastPage = songs.length < 5;

        res.status(200).json({ songs, lastPage });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});


router.route('/topfavorites').get(async (req, res) => {
    const songsPerPage = 5;
    const skip = songsPerPage * (req.query.page - 1);

    try {
        const songs = await User.aggregate([
            {
                $project: {
                    favorites: "$favorites",
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
                $project: {
                    composition_id: "$favorites.composition_id",
                },
            },
            {
                $group: {
                    _id: "$composition_id",
                    likes: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "compositions._id",
                    as: "favorites",
                }
            },
            {
                $project: {
                    _id: 1,
                    likes: 1,
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
                    _id: 1,
                    likes: 1,
                    favorites: 1,
                    match: { $eq: ["$_id", "$favorites._id"] }
                },
            },
            { $match: { match: true } },
            {
                $project: {
                    likes: 1,
                    compositions: "$favorites",
                },
            },
            {
                $project: {
                    likes: 1,
                    composition_id: "$compositions._id",
                    title: "$compositions.title",
                    username: "$compositions.username",
                    num_comments: { $size: "$compositions.comments" },
                    likes: 1,
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
                    likes: { $first: "$likes" },
                    comments: { $push: "$comments" },
                    genre: { $first: "$genre" },
                    path: { $first: "$path" },
                    listens: { $first: "$listens" },
                }
            },
            { $sort: { "likes": -1, "_id": 1 } },
            { $skip: skip },
            { $limit: songsPerPage },
        ]);

        if (!songs) throw Error('No songs');

        const lastPage = songs.length < 5;

        res.status(200).json({ songs, lastPage });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});


module.exports = router;