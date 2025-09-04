const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../../database/model/User");
const { RequestInputError, ValidationError } = require("../../helper/errors");
const validationSchema = require("../../helper/validate");

const registerUser = async (req, res) => {
    try {

        const { name, username, email, password, phone_no } = req.body;

        if (!name) throw new RequestInputError('Name is required');
        if (!username) throw new RequestInputError('Username is required');
        if (!email) throw new RequestInputError('Email is required');
        if (!password) throw new RequestInputError('Password is required');
        if (!phone_no) throw new RequestInputError('Phone number is required');

        const validationResult = validationSchema({ email, password, phone_no });

        if (validationResult.success === false) throw new ValidationError(validationResult.message);

        const existingUsername = await User.findOne({ username });
        if (existingUsername) throw new ValidationError('Username is already taken');

        const existingEmail = await User.findOne({ email });
        if (existingEmail) throw new ValidationError('Email id is already in use');

        const existingPhoneNumber = await User.findOne({ phone_no });
        if (existingPhoneNumber) throw new ValidationError('Phone number is already in use');

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            name,
            username,
            email,
            password: hashPassword,
            phone_no
        });

        await newUser.save();

        res.status(200).json({ success: true, message: 'User registered successfully' });

    } catch (error) {
        console.error(error);
        res.status(error.error_code || 500).json({ success: false, message: error.message || 'Registration failed' });
    }
};

const loginUser = async (req, res) => { 
    try {
        const { credentials , password } = req.body;

        if (!credentials) throw new RequestInputError('Email ID or Username are required');
        if (!password) throw new RequestInputError('Password is required');

        const user = await User.findOne({ $or: [{ email: credentials }, { username: credentials }] });
        if (!user) throw new ValidationError('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new ValidationError('Invalid credentials');

        let json = { "user_id": user.userId }
        let jwtToken = jwt.sign(json, process.env.JWT_SECRET, { expiresIn: 3600 });

        res.status(200).json({ success: true, message: 'Login successful', token: jwtToken });

    } catch (error) {
        console.error(error);
        res.status(error.error_code || 500).json({ success: false, message: error.message || 'Login failed' });
    }
};

module.exports = {
    registerUser,
    loginUser
};

// ============================================================================================

let req = {
    name: 'Test User',
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'Test@1234',
    phone_no: '1234567890'
}