const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// @desc Register a user
// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async (req, res) => {

    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All 3 fields are mandatory!");
    }

    const userAvailable = await User.findOne({ email });


    if (userAvailable)
    {
        res.status(400);
        throw new Error("User already registered!");
    }

    // hashing of password using bcrypt
    const hashPassword = await bcrypt.hash(password, 10);
    // 10 is the salt round(affects cost)
    
    const user = await User.create({
        username,
        email,
        password: hashPassword
    });

    console.log(`User ceated ${user}`);
    if (user) {
        res.status(201).json({ _id: user.id, email: user.email });
    }
    else {
        res.status(400);
        throw new Error("Data not valid!");
    }
});

// @desc Login a user
// @route POST /api/users/login
// @access public

const loginUser = asyncHandler(async (req, res) => {

    /* JWT - 
        JSON WEB TOKEN (To create token for login session) 
    */
    const {email, password} = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({ email });
    // compare password with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {

        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            },
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "15m"}
    );
        res.status(200).json({accessToken});
    } 
    else {
        res.status(401);
        throw new Error("Email or Password not valid!");
    }
    
});

// @desc Currrent user info
// @route GET /api/users/current
// @access private

const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    currentUser
};