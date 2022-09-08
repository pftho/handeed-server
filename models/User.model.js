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
        credentials: Number,
    },
    {
        timestamps: true,
    }
);

const User = model('User', userSchema);

module.exports = User;
