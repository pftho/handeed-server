const { Schema, model } = require('mongoose');

const chatSchema = new Schema(
    {
        chatname: {
            type: String,
            required: [true, 'chatname is required'],
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        ad: { type: Schema.Types.ObjectId, ref: 'Ad' },
        messages: [
            new Schema({
                author: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                message: String,
                time: Date,
            }),
        ],
    },

    {
        timestamps: true,
    }
);

const Chat = model('Chat', chatSchema);

module.exports = Chat;

// front side: call method to check if chat open call backend --> axios.get la method du dessus
// it will be a useEffect in the ad detail page that will check if room exists, if so setIsChat visite = true
// if  true = it was already opened so I don't use button (if in the front side to hide button and display chat)
// if false -> call the GET create - axios.get in the same place were I decrement

//in socket io server when someones joins the room, check that the room exists in db w
