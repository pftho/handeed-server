require('../db/index');
const mongoose = require('mongoose');
const Ad = require('../models/Ad.model');

const ads = [
    {
        title: 'Flower print dress',
        description: 'Cute little dress, perfect for spring!',
        brand: 'Mango',
        size: 'L',
        category: 'Dress',
        condition: 'Like New',
        status: 'Available',
        owner: '631d230ccab84d0906e126c9',
        city: 'Paris',
        image: 'https://images1.vinted.net/t/02_016ec_oLg8tFvnaAxfAyZW7w4NCqNy/f800/1662218095.jpeg?s=05185e3415a2bdac85d45fb26c35de34a580d65c',
    },
    {
        title: 'Leather Backpack',
        description: 'Le Baroudeur model, to carry your stuff around...',
        brand: 'Paul Marius',
        size: 'Other',
        category: 'Bag',
        condition: 'Good Condition',
        status: 'Reserved',
        owner: '631d230ccab84d0906e126c9',
        city: 'Paris',
        image: 'https://images1.vinted.net/t/02_00264_VyS9meKW5YMadM5tJ8o5wc6p/f800/1662629399.jpeg?s=245fc18f0d73835e1dd11040a755af913b7afc53',
    },
    {
        title: 'Party top',
        description: 'Golden top with crossed straps to party all night long!',
        brand: 'Stradivarius',
        size: 'S',
        category: 'Top',
        condition: 'Brand New',
        status: 'Available',
        owner: '631d230ccab84d0906e126c9',
        city: 'Paris',
        image: 'https://images1.vinted.net/t/02_00782_MMrL2SG5Ph2V654Xt65dxPd7/f800/1662366609.jpeg?s=81ec98a368154ad93e590032895daa71464b27a9',
    },
    {
        title: 'Lewis Jeans',
        description: 'Ribcage straight ankle model.',
        brand: 'Lewis',
        size: 'L',
        category: 'Trousers',
        condition: 'Worn',
        status: 'Given',
        owner: '631d230ccab84d0906e126c9',
        city: 'Paris',
        image: 'https://images1.vinted.net/t/02_023bc_snsC6VQiupKTeiozdtdkBXmu/f800/1662632687.jpeg?s=ca09f7df51eba520bb21c5389bb6bd6240d3deb6',
    },
    {
        title: 'Cool sweater',
        description: 'Grey sweater with Pepe Jeans inscription.',
        brand: 'Pepe Jeans',
        size: 'M',
        category: 'Sweater',
        condition: 'Like New',
        status: 'Available',
        owner: '631d230ccab84d0906e126c9',
        city: 'Paris',
        image: 'https://images1.vinted.net/t/02_023bc_snsC6VQiupKTeiozdtdkBXmu/f800/1662632687.jpeg?s=ca09f7df51eba520bb21c5389bb6bd6240d3deb6',
    },
    {
        title: 'Comfy onesie',
        description:
            'Doe pajama jumpsuit. Very warm and comfy with fleece on the inside',
        brand: 'Etam',
        size: 'M',
        category: 'Pyjamas',
        condition: 'Good Condition',
        status: 'Reserved',
        owner: '631d230ccab84d0906e126ca',
        city: 'Paris',
        image: 'https://images1.vinted.net/t/02_008b4_D6e4fuiEi7GXcsNRP1gjiYD3/f800/1661784667.jpeg?s=404e26ed84488eed66d539819e893dbe012d7e22',
    },
    {
        title: 'Summer shorts',
        description:
            'Mustard color, elastic waist and knot to tie. Never worn, still tagged.',
        brand: 'Etam',
        size: 'L',
        category: 'Shorts',
        condition: 'Brand New',
        status: 'Reserved',
        owner: '631d230ccab84d0906e126ca',
        city: 'Paris',
        image: 'https://images1.vinted.net/t/02_021ed_MbKjAdxKekGziZdpcmkR6nXE/f800/1656775989.jpeg?s=fd86f92a4375791d798c20009b127dde5d2c1698',
    },
    {
        title: 'Flower printed blouse',
        description:
            'Pretty little blouse you can wear with anything',
        brand: 'Zara',
        size: 'XS',
        category: 'Top',
        condition: 'Brand New',
        status: 'Available',
        owner: '631d230ccab84d0906e126ca',
        city: 'Paris',
        image: 'https://images1.vinted.net/t/02_01a44_xHAHc3spefywm7sfep4nw7Kf/f800/1663310370.jpeg?s=c8f04d5863a14b5bebfbdf309acab004164562f0',
    },
    {
        title: 'Denim jacket',
        description:
            "Levi's vintage denim jacket, barely worn.",
        brand: "Levi's",
        size: 'L',
        category: 'Jacket',
        condition: 'Good Condition',
        status: 'Reserved',
        owner: '631d230ccab84d0906e126ca',
        city: 'Paris',
        image: 'https://images1.vinted.net/t/02_00af4_LigEnB5BCoS5BnN4WsPFzA8i/f800/1662465448.jpeg?s=30e2003d8bcd068d206f74cf72b3dbbff04f02c6',
    },
    {
        title: 'Nike bra',
        description:
            "Nike sports bra that doesn't fit me anymore",
        brand: 'Nike',
        size: 'M',
        category: 'Sport',
        condition: 'Like New',
        status: 'Available',
        owner: '631d230ccab84d0906e126ca',
        city: 'Paris',
        image: 'https://images1.vinted.net/t/02_020bb_cK1LbeaQD9CTF3TRJ2Fo6y6S/f800/1663076747.jpeg?s=0b620e6bfa205be9600697da5caf588387692241',
    },
];

Ad.insertMany(ads)
    .then((ads) => {
        ads.forEach((ad) => console.log(ad.title));
        mongoose.connection.close();
    })
    .catch((saveErr) => console.error(`Save failed: ${saveErr}`));
