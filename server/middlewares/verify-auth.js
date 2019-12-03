
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verified = jwt.verify(token, process.env.JWT_KEY);
        req.metadata = verified;
        next();

    } catch (error) {
        res.status(401).json({
            error: 'Authorization failed'
        })
    }

};