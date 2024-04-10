const verifyApiKey = async (req, res, next) => {
    if (req.headers["x-auth-token"] === process.env.MS_EXPERIENCE_API_KEY) {
        next();
    }
    else {
        res.status(401).send("API key not verified");
    }
}

module.exports = verifyApiKey;