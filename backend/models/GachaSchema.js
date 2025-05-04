const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Character/Servant Schema
const characterSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    class: {
        type: String,
        required: true,
        enum: ['Saber', 'Archer', 'Lancer', 'Rider', 'Caster', 'Assassin', 'Berserker', 'Ruler', 'Avenger', 'Alter Ego', 'Foreigner']
    },
    rarity: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    imageUrl: {
        type: String,
        default: 'default-character.png'
    },
    description: {
        type: String,
        default: 'https://fgo.gamepress.gg/sites/default/files/2019-04/TutorialServants.png'
    }
}, { timestamps: true });

// User Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    servants: [{
        character: {
            type: Schema.Types.ObjectId,
            ref: 'Character'
        },
        obtainedAt: {
            type: Date,
            default: Date.now
        },
        level: {
            type: Number,
            default: 1
        }
    }],
    currency: {
        type: Number,
        default: 100
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Gacha Pool Schema
const gachaPoolSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String,
        default: 'default-pool.png'
    },
    characters: [{
        character: {
            type: Schema.Types.ObjectId,
            ref: 'Character'
        },
        dropRate: {
            type: Number,
            required: true
        }
    }],
    cost: {
        type: Number,
        default: 10
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    }
}, { timestamps: true });

// Create the models
const Character = mongoose.model('Character', characterSchema);
const User = mongoose.model('User', userSchema);
const GachaPool = mongoose.model('GachaPool', gachaPoolSchema);

module.exports = {
    Character,
    User,
    GachaPool
};