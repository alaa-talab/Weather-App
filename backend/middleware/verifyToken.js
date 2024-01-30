const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const bearerHeader = req.header('Authorization');

    if (!bearerHeader) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    // Split the header to get the token
    const token = bearerHeader.split(' ')[1]; // Assumes 'Bearer [token]' format

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.user; // Make sure to set it correctly based on your token payload structure
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

module.exports = verifyToken;
