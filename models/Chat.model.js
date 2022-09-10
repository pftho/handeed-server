const { Schema, model } = require('mongoose');

const chatSchema = new Schema(
    {
        recipient: {
            type: { type: Schema.Types.ObjectId, ref: 'User' },
        },
        sender: {
            type: { type: Schema.Types.ObjectId, ref: 'User' },
        },
        messages: String,
    },

    {
        timestamps: true,
    }
);

const Chat = model('Chat', chatSchema);

module.exports = Chat;
