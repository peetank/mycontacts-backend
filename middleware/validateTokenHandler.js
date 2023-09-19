const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");


const validateToken = asyncHandler(async (req, res, next) => {

    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User UNAUTHORIZED!");
            }
            req.user = decoded.user;
            next();
            /* If the current middleware function does not end the request-response cycle, 
            it must call next() to pass control to the next middleware function. 
            Otherwise, the request will be left hanging. */
        });

        if (!token) {
            res.status(401);
            throw new Error("User Unauthorized or Missing Token!");
        }
    }
});

module.exports = validateToken;