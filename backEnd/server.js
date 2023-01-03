const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3600

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})