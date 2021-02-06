const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        composition_id: { type: mongoose.Types.ObjectId },
        user_id: { type: mongoose.Types.ObjectId }, //added to standalone compositions
        title: { type: String },
        description: { type: String },
        genre: { type: String },
        image_id: { type: mongoose.Types.ObjectId },
        file_id: { type: mongoose.Types.ObjectId },
        listens: { type: Number },
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