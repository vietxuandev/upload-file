const express = require('express');
const router = express.Router();
const { listFiles, uploadFile } = require('../drive-api/index')
const upload = require('../middlewares/uploadMiddleware');
const stream = require('stream');

router.get('/', async (req, res) => {
    const data = await listFiles()
    res.json(data)
});

router.post('/upload', upload.single('image'), async (req, res) => {
    const fileObject = req.file;
    const { originalname, mimetype } = fileObject;
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const data = await uploadFile(bufferStream, originalname, mimetype)
    res.json(data)
});


module.exports = router;