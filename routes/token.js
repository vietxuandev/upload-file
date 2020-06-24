const express = require('express');
const router = express.Router();
const { generateAuthUrl, getToken } = require('../controllers/google')

router.get('/', async (req, res) => {
    res.json(generateAuthUrl())
});

router.get('/callback', async (req, res) => {
    const { code } = req.query;
    getToken(code);
    res.json('getToken');
});


module.exports = router;