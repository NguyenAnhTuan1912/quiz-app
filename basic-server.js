const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/public/css', express.static(path.join(__dirname, '/public/css')));
app.use('/static', express.static(path.join(__dirname, '/dist/static/client')));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(path.join(__dirname, '/public/index.html')));
})

app.listen(PORT, () => { console.log(`Server is running on localhost:${PORT}`) });