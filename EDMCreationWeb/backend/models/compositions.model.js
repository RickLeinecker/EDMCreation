const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        composition_id: { type: mongoose.Types.ObjectId },
        user_id: { type: mongoose.Types.ObjectId }, //added to standalone compositions
        username: { type: String },
        title: { type: String },
        description: { type: String },
        genre: { type: String },
        image_id: { type: mongoose.Types.ObjectId },
        file_id: { type: mongoose.Types.ObjectId },
        filename: { type: String },
        path: { type: String },
        listens: { type: Number },
        favorites: { type: Number },
        comment_count: { type: Number },
        comments: [
            {
                comment_id: { type: mongoose.Types.ObjectId },
                user_id: { type: mongoose.Types.ObjectId },
                last_modified: { type: Date },
                comment:{ type: String }
            }
        ],
        created_on: { type: Date },
        last_modified: { type: Date, default: Date.now }
    },
    {
        timestamps: true
    }
);

const Composition = mongoose.model('Composition', userSchema);

module.exports = Composition;