const express = require('express');
const { authRouter } = require('./routes/auth');

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter)

module.exports = {
    apiRouter
}