const mongoose = require('mongoose');
const { Character, User, GachaPool } = require('./models/GachaSchema');
require('dotenv').config();

async function resetGachaDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        console.log('Dropping existing collections...');
        await Character.deleteMany({});
        await User.deleteMany({});
        await GachaPool.deleteMany({});
        console.log('All collections dropped successfully');

        console.log('Creating characters...');
        const characters = await Character.create([
            // 5-star Servants
            { 
                name: "Artoria Pendragon", 
                class: "Saber", 
                rarity: 5, 
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/vdwyrslucrd5p24vtrx0" 
            },
            { 
                name: "Jeanne d'Arc", 
                class: "Ruler", 
                rarity: 5, 
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/dmlqmimzaemhpczdqlve" 
            },
            { 
                name: "Altera", 
                class: "Saber", 
                rarity: 5, 
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/w9hndzgjwfypiazmo9y8" 
            },

            // 4-star Servants
            { 
                name: "EMIYA", 
                class: "Archer", 
                rarity: 4, 
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/xwxnqkxjq1lnlspulgvk" 
            },
            { 
                name: "Elizabeth Bathory", 
                class: "Lancer", 
                rarity: 4, 
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/crtrabxlksbq47eaicwv" 
            },
            { 
                name: "Heracles", 
                class: "Berserker", 
                rarity: 4, 
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/bxqrz1mbe6sih4ycyxop" 
            },

            // 3-star Servants
            { 
                name: "Cu Chulainn", 
                class: "Lancer", 
                rarity: 3, 
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/xxxg5wk13uowjosfblia" 
            },
            { 
                name: "Hassan of the Cursed Arm", 
                class: "Assassin", 
                rarity: 3, 
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/kizhwhtf5atnisakhrog" 
            },
            { 
                name: "Medusa", 
                class: "Rider", 
                rarity: 3, 
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/jjq45zw6htaugeg2ihgn" 
            },

            // Limited 5 star servants
            {
                name: "Anastasia", 
                class: "Caster", 
                rarity: 5, 
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/mozz865a0j1csp4ctvvs" 
            },
            { 
                name: "Napoleon", 
                class: "Archer", 
                rarity: 5, 
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/ly9oicbxcv5qbrjqbqnj"
            },
            {
                name: "Qin Shi Huang",
                class: "Ruler",
                rarity: 5,
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/giix53b7pio8kipsjh9x"
            },
            {
                name: "Arjuna Alter",
                class: "Berserker",
                rarity: 5,
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/mcjc7s8ncxh9ts9qfako"
            },
            {
                name: "Super Orion",
                class: "Archer",
                rarity: 5,
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/tjagkpl9xnbtfrfyw8g4"
            },
            {
                name: "Altria Caster",
                class: "Caster",
                rarity: 5,
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/vwujg0qic9gdtshaafmk"
            },
            {
                name: "Tezcatlipoca",
                class: "Assassin",
                rarity: 5,
                imageUrl: "https://res.cloudinary.com/dnqt2uxvp/image/upload/f_auto,q_auto/adqwknslsugq5tjvf0an"
            }
        ]);

        console.log(`Created ${characters.length} characters`);

        console.log('Creating gacha pools...');

        const standardPool = await GachaPool.create({
            name: "Standard Summoning",
            description: "Standard summoning pool with all servants available",
            imageUrl: "https://fgo.gamepress.gg/sites/default/files/2024-05/20240513%20Traum%20Large.png",
            characters: [
                // 5-stars (lower rates)
                { character: characters[0]._id, dropRate: 1 },  // Artoria 1%
                { character: characters[1]._id, dropRate: 1 },  // Jeanne 1%
                { character: characters[2]._id, dropRate: 1 },  // Altera 1%
                
                // 4-stars (medium rates)
                { character: characters[3]._id, dropRate: 3 },  // EMIYA 3%
                { character: characters[4]._id, dropRate: 3 },  // Elizabeth 3%
                { character: characters[5]._id, dropRate: 3 },  // Heracles 3%
                
                // 3-stars (high rates)
                { character: characters[6]._id, dropRate: 29 }, // Cu 29%
                { character: characters[7]._id, dropRate: 29 }, // Hassan 29%
                { character: characters[8]._id, dropRate: 30 }  // Medusa 30%
            ],
            cost: 3,
            isActive: true
        });

        const lb1Pool = await GachaPool.create({
            name: "Lostbelt 1 : Anastasia Summoning",
            description: "Lostbelt 1 summoning pool with rate up for Anastasia",
            imageUrl: "https://static.mana.wiki/grandorder/Anastasia%20Pickup%20Banner_0.png?width=480&height=173",
            characters: [
                // 5-stars (lower rates)
                { character: characters[9]._id, dropRate: 3 },  // Anastasia 3%
                
                // 4-stars (medium rates)
                { character: characters[3]._id, dropRate: 3 },  // EMIYA 3%
                { character: characters[4]._id, dropRate: 3 },  // Elizabeth 3%
                { character: characters[5]._id, dropRate: 3 },  // Heracles 3%
                
                // 3-stars (high rates)
                { character: characters[6]._id, dropRate: 29 }, // Cu 29%
                { character: characters[7]._id, dropRate: 29 }, // Hassan 29%
                { character: characters[8]._id, dropRate: 30 }  // Medusa 30%
            ],
            cost: 3,
            isActive: true
        });

        const lb2Pool = await GachaPool.create({
            name: "Lostbelt 2 : Gotterdammerung Summoning",
            description: "Lostbelt 2 summoning pool with rate up for Napoleon",
            imageUrl: "https://static.mana.wiki/grandorder/20200618%20Napoleon%20Pickup_0.png?width=480&height=173",
            characters: [
                // 5-stars (lower rates)
                { character: characters[10]._id, dropRate: 3 },  // Napoleon 1%
                
                // 4-stars (medium rates)
                { character: characters[3]._id, dropRate: 3 },  // EMIYA 3%
                { character: characters[4]._id, dropRate: 3 },  // Elizabeth 3%
                { character: characters[5]._id, dropRate: 3 },  // Heracles 3%
                
                // 3-stars (high rates)
                { character: characters[6]._id, dropRate: 29 }, // Cu 29%
                { character: characters[7]._id, dropRate: 29 }, // Hassan 29%
                { character: characters[8]._id, dropRate: 30 }  // Medusa 30%
            ],
            cost: 3,
            isActive: true
        });

        const lb3Pool = await GachaPool.create({
            name: "Lostbelt 3 : SIN Summoning",
            description: "Lostbelt 3 summoning pool with rate up for Qin Shi Huang",
            imageUrl: "https://static.mana.wiki/grandorder/20220809%2018M%20DL%20Pickup%20Summon_0.png?width=480&height=173",
            characters: [
                // 5-stars (lower rates)
                { character: characters[11]._id, dropRate: 3 },  // Qin Shi Huang 3%
                
                // 4-stars (medium rates)
                { character: characters[3]._id, dropRate: 3 },  // EMIYA 3%
                { character: characters[4]._id, dropRate: 3 },  // Elizabeth 3%
                { character: characters[5]._id, dropRate: 3 },  // Heracles 3%
                
                // 3-stars (high rates)
                { character: characters[6]._id, dropRate: 29 }, // Cu 29%
                { character: characters[7]._id, dropRate: 29 }, // Hassan 29%
                { character: characters[8]._id, dropRate: 30 }  // Medusa 30%
            ],
            cost: 3,
            isActive: true
        });

        const lb4Pool = await GachaPool.create({
            name: "Lostbelt 4 : Yuga Kshetra Summoning",
            description: "Lostbelt 4 summoning pool with rate up for Arjuna Alter",
            imageUrl: "https://static.mana.wiki/grandorder/20240818%20Road%20to%207%20Lostbelt%204%20Pickup%20Summon.png?width=480&height=173",
            characters: [
                // 5-stars (lower rates)
                { character: characters[12]._id, dropRate: 3 },  // Arjuna Alter 3%
                
                // 4-stars (medium rates)
                { character: characters[3]._id, dropRate: 3 },  // EMIYA 3%
                { character: characters[4]._id, dropRate: 3 },  // Elizabeth 3%
                { character: characters[5]._id, dropRate: 3 },  // Heracles 3%
                
                // 3-stars (high rates)
                { character: characters[6]._id, dropRate: 29 }, // Cu 29%
                { character: characters[7]._id, dropRate: 29 }, // Hassan 29%
                { character: characters[8]._id, dropRate: 30 }  // Medusa 30%
            ],
            cost: 3,
            isActive: true
        });

        const lb5Pool = await GachaPool.create({
            name: "Lostbelt 5 : Atlantis Summoning",
            description: "Lostbelt 5 summoning pool with rate up for Super Orion",
            imageUrl: "https://static.mana.wiki/grandorder/20211201%20LB5%20Pickup1_0.png?width=480&height=173",
            characters: [
                // 5-stars (lower rates)
                { character: characters[13]._id, dropRate: 3 },  // Super Orion 3%
                
                // 4-stars (medium rates)
                { character: characters[3]._id, dropRate: 3 },  // EMIYA 3%
                { character: characters[4]._id, dropRate: 3 },  // Elizabeth 3%
                { character: characters[5]._id, dropRate: 3 },  // Heracles 3%
                
                // 3-stars (high rates)
                { character: characters[6]._id, dropRate: 29 }, // Cu 29%
                { character: characters[7]._id, dropRate: 29 }, // Hassan 29%
                { character: characters[8]._id, dropRate: 30 }  // Medusa 30%
            ],
            cost: 3,
            isActive: true
        });

        const lb6Pool = await GachaPool.create({
            name: "Lostbelt 6 : Avalon le Fae Summoning",
            description: "Lostbelt 6 summoning pool with rate up for Altria Caster",
            imageUrl: "https://static.mana.wiki/grandorder/202306112%20Avalon%20Altria%20Pickup.png?width=480&height=173",
            characters: [
                // 5-stars (lower rates)
                { character: characters[14]._id, dropRate: 3 },  // Altria Caster 3%
                
                // 4-stars (medium rates)
                { character: characters[3]._id, dropRate: 3 },  // EMIYA 3%
                { character: characters[4]._id, dropRate: 3 },  // Elizabeth 3%
                { character: characters[5]._id, dropRate: 3 },  // Heracles 3%
                
                // 3-stars (high rates)
                { character: characters[6]._id, dropRate: 29 }, // Cu 29%
                { character: characters[7]._id, dropRate: 29 }, // Hassan 29%
                { character: characters[8]._id, dropRate: 30 }  // Medusa 30%
            ],
            cost: 3,
            isActive: true
        });

        const lb7Pool = await GachaPool.create({
            name: "Lostbelt 7 : Nahui Mitclan Summoning",
            description: "Lostbelt 7 summoning pool with rate up for Tezcatlipoca",
            imageUrl: "https://static.mana.wiki/grandorder/20250115%20LB7%20Part%202%20Tezcatlipoca%20Pickup%20Summon.png?width=480&height=173",
            characters: [
                // 5-stars (lower rates)
                { character: characters[15]._id, dropRate: 3 },  // Tezcatlipoca 1%
                
                // 4-stars (medium rates)
                { character: characters[3]._id, dropRate: 3 },  // EMIYA 3%
                { character: characters[4]._id, dropRate: 3 },  // Elizabeth 3%
                { character: characters[5]._id, dropRate: 3 },  // Heracles 3%
                
                // 3-stars (high rates)
                { character: characters[6]._id, dropRate: 29 }, // Cu 29%
                { character: characters[7]._id, dropRate: 29 }, // Hassan 29%
                { character: characters[8]._id, dropRate: 30 }  // Medusa 30%
            ],
            cost: 3,
            isActive: true
        });

        console.log(`Created ${await GachaPool.countDocuments()} gacha pools`);

        console.log('Creating test users...');

        const admin = await User.create({
            username: "admin",
            email: "admin@example.com",
            password: "admin123",  // In a real app, use proper hashing
            currency: 1000,
            isAdmin: true
        });

        const testUser = await User.create({
            username: "testuser",
            email: "test@example.com",
            password: "password123",  // In a real app, use proper hashing
            currency: 100,
        });

        console.log(`Created ${await User.countDocuments()} users`);

        const initialServants = [
            {
                character: characters[3]._id, // EMIYA
                level: 1,
                obtainedAt: new Date()
            },
            {
                character: characters[6]._id, // Cu
                level: 1,
                obtainedAt: new Date()
            }
        ];

        testUser.servants.push(...initialServants);
        await testUser.save();

        console.log(`Added ${initialServants.length} initial servants to ${testUser.username}`);

        const poolCount = await GachaPool.countDocuments();
        const charCount = await Character.countDocuments();
        const userCount = await User.countDocuments();

        console.log('\nDatabase Reset Complete');
        console.log(`- ${charCount} characters created`);
        console.log(`- ${poolCount} gacha pools created`);
        console.log(`- ${userCount} users created`);
        console.log('\nUser Credentials:');
        console.log('- Username: admin, Password: admin123');
        console.log('- Username: testuser, Password: password123');

    } catch (error) {
        console.error('Error during database reset:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

resetGachaDatabase();