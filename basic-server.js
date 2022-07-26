const express = require('express');
const path = require('path');

const { quiz } = require('./src/js/util/handlers/quiz');
const { categories } = require('./src/js/util/handlers/categories');
const { category } = require('./src/js/util/handlers/category');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/public/css', express.static(path.join(__dirname, '/public/css')));
app.use('/static', express.static(path.join(__dirname, '/dist/static/client')));

app.route('/api/quiz/:category/:id').get(quiz);
app.route('/api/quiz/categories').get(categories);
app.route('/api/quiz/:category').get(category);

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(path.join(__dirname, '/public/index.html')));
});

app.listen(PORT, () => { console.log(`Server is running on localhost:${PORT}`) });