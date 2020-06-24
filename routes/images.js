const express = require('express');
const router = express.Router();
const { listFiles, uploadFile } = require('../drive-api/index')
const upload = require('../middlewares/uploadMiddleware');

router.get('/', async (req, res) => {
    const data = await listFiles()
    res.json(data)
});

router.post('/upload', upload.single('file'), async (req, res) => {
    const fileObject = req.file;
    const data = await uploadFile(fileObject)
    res.json(data)
});


module.exports = router;