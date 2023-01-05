require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger.js')
const errorHandler = require('./middleware/errorHandler.js')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./models/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3900


connectDB()
app.use(logger);

app.use(express.json());
app.use(cookieParser())
app.use(cors(corsOptions))
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/users', require('./routes/userRoutes'))
app.use('/', require('./routes/root'))


app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})