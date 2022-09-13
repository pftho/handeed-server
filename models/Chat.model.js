const { Schema, model } = require('mongoose');

const chatSchema = new Schema(
    {
        chatname: {
            type: String,
            unique: true,
            required: [true, 'chatname is required'],
        },
        sender: {
            type: { type: Schema.Types.ObjectId, ref: 'User' },
            unique: true,
            required: true,
        },
        sender: {
            type: { type: Schema.Types.ObjectId, ref: 'User' },
            unique: true,
            required: true,
        },

        ad: { type: Schema.Types.ObjectId, ref: 'Ad' },
        messages: [String],
    },

    {
        timestamps: true,
    }
);

const Chat = model('Chat', chatSchema);

chatSchema.index({ location: '2dsphere' });

module.exports = Chat;


//back: POST -> When open chat call backend post create
// back: GET /adId + toekn to see what user is connected -->  check if chat in db with sender === curent user -> if ad is mine, check if recipient id === my id // if add not mine --> check if sender === me -> return true false chat 
// front side: call method to check if chat open call backend --> axios.get la method du dessus 
// it will be a useEffect in the ad detail page that will check if room exists, if so setIsChat visite = true
// if  true = it was already opened so I don't use button (if in the front side to hide button and display chat)
// if false -> call the GET create - axios.get in the same place were I decrement


//in socket io server when someones joins the room, check that the room exists in db w
