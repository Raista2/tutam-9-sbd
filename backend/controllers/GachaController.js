const { Character, User, GachaPool } = require('../models/GachaSchema');

// Helper function to perform the gacha pull based on character probabilities
const performGachaPull = async (poolId) => {
    const pool = await GachaPool.findById(poolId).populate('characters.character');
    if (!pool) {
        throw new Error('Gacha pool not found');
    }

    const totalRate = pool.characters.reduce((sum, char) => sum + char.dropRate, 0);
    if (Math.abs(totalRate - 100) > 0.01) {
        console.warn(`Warning: Total drop rate in pool ${pool.name} is ${totalRate}%, not 100%`);
    }

    const roll = Math.random() * 100;
    let cumulativeRate = 0;

    for (const charEntry of pool.characters) {
        cumulativeRate += charEntry.dropRate;
        if (roll <= cumulativeRate) {
            return charEntry.character;
        }
    }

    return pool.characters[pool.characters.length - 1].character;
};

// Controller methods
exports.getAllPools = async (req, res) => {
    try {
        const pools = await GachaPool.find({ isActive: true }).select('-characters');
        res.status(200).json(pools);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPoolDetails = async (req, res) => {
    try {
        const pool = await GachaPool.findById(req.params.poolId)
            .populate('characters.character');
        if (!pool) {
            return res.status(404).json({ message: 'Gacha pool not found' });
        }
        res.status(200).json(pool);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.pullGacha = async (req, res) => {
    try {
        const { userId, poolId } = req.body;

        // Find the user and pool
        const user = await User.findById(userId);
        const pool = await GachaPool.findById(poolId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!pool) {
            return res.status(404).json({ message: 'Gacha pool not found' });
        }

        // Check if user has enough currency
        if (user.currency < pool.cost) {
            return res.status(400).json({ message: 'Insufficient currency' });
        }

        // Perform the gacha pull
        const pulledCharacter = await performGachaPull(poolId);

        // Deduct currency
        user.currency -= pool.cost;

        // Add character to user's servants
        user.servants.push({
            character: pulledCharacter._id,
            obtainedAt: Date.now()
        });

        await user.save();

        // Return the pulled character
        res.status(200).json({
            success: true,
            message: `Congratulations! You pulled ${pulledCharacter.name}`,
            character: pulledCharacter
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserServants = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate('servants.character');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.servants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        
        // Check if user exists and password matches
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        
        // In a real app, you'd use bcrypt to compare hashed passwords
        // Here we're doing a simple comparison for demo purposes
        if (password !== user.password) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        
        // Create a safe user object (without password)
        const safeUser = {
            id: user._id,
            username: user.username,
            email: user.email,
            currency: user.currency
        };
        
        // Return user data
        res.status(200).json({
            success: true,
            user: safeUser
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user with email already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with that email or username already exists'
            });
        }
        
        // Create new user
        // In a real app, you'd hash the password with bcrypt before saving
        const newUser = new User({
            username,
            email,
            password, // Should be hashed in production
            currency: 100 // Starting currency
        });
        
        await newUser.save();
        
        res.status(201).json({
            success: true,
            message: 'Registration successful'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Delete the user from the database
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'User account deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to delete user account' 
        });
    }
};