const { Schema, model } = require('mongoose');

const adSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Other'],
        },
        category: {
            type: String,
            enum: [
                'Accessory',
                'Bag',
                'Coat',
                'Dress',
                'Jacket',
                'Pyjamas',
                'Shorts',
                'Shoes',
                'Skirt',
                'Sport',
                'Sweater',
                'Top',
                'Trousers',
                'Underwear',
                'Other',
            ],
            required: true,
        },
        condition: {
            type: String,
            enum: ['Brand New', 'Like New', 'Good Condition', 'Worn', 'Broken'],
            required: true,
        },
        status: {
            type: String,
            enum: ['Available', 'Reserved', 'Given'],
            required: true,
        },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        city: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default:
                'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
        },
    },
    {
        timestamps: true,
    }
);

const Ad = model('Ad', adSchema);

module.exports = Ad;
