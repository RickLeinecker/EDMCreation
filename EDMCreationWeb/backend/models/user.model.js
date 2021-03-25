const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: { type: String },
        email: { type: String },
        password: { type: String },
        first_name: { type: String },
        last_name: { type: String },
        description: { type: String },
        upload_count: { type: Number },
        listens_count: { type: Number },
        image_id: { type: mongoose.Types.ObjectId },
        compositions: [
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
            }
        ],
        following: [
            {
                user_id: { type: mongoose.Types.ObjectId },
                created_on: { type: Date }
            }
        ],
        favorites: [
            {
                composition_id: { type: mongoose.Types.ObjectId },
                created_on: { type: Date }
            }
        ],
        comment_likes: [
            {
                comment_id: { type: mongoose.Types.ObjectId },
                created_on: { type: Date }
            }
        ],
        training_file_id: { type: mongoose.Types.ObjectId },
        created_on: { type: Date },
        last_modified: { type: Date }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;