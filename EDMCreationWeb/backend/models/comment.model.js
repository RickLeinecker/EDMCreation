const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        comment_id: { type: mongoose.Types.ObjectId },
        user_id: { type: mongoose.Types.ObjectId },
        username: { type: String },
        comment: { type: String },
        created_on: { type: Date, default: Date.now },
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Comment', userSchema);

module.exports = Comment;