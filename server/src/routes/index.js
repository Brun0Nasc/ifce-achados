const express = require('express');
const fooRouter = require('./foo/router');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('IFCE Achados');
})
router.use('/foo', fooRouter)

module.exports = router;