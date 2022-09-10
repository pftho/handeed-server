const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, 'username is required'],
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email is required'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        ads: [{ type: Schema.Types.ObjectId, ref: 'Ad' }],
        reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
        address: String,
        messages: [{ type: Schema.Types.ObjectId, ref: 'Messages' }],
        credentials: {
            type: Number,
            default: 3,
        },
        imageUrl: {
            type: String,
            default: 'https://i.stack.imgur.com/34AD2.jpg',
        },
        location: {
            type: {
                type: String,
            },
            coordinates: {
                type: [Number],
            },
        },
    },

    {
        timestamps: true,
    }
);

const User = model('User', userSchema);

module.exports = User;
