const express = require('express');
const router = express.Router();
const { listFiles, uploadFile } = require('../drive-api/index')
const upload = require('../middlewares/uploadMiddleware');

router.get('/', async (req, res) => {
    const data = await listFiles()
    res.json(data)
});

router.post('/upload', (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            return res.json({ error: { message: err.message } })
        }
        const fileObject = req.file;
        const data = await uploadFile(fileObject)
        return res.json(data)
    })
});


module.exports = router;