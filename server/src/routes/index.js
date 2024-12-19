const express = require('express');
const fooRouter = require('./foo/router');

const router = express.Router();

router.use('/foo', fooRouter)

module.exports = router;