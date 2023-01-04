const express = require('express')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger.js')
const errorHandler = require('./middleware/errorHandler.js')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 3900
app.use(logger);


app.use(express.json());
app.use(cookieParser())
app.use(cors(corsOptions))
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))



app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})