const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const { quiz } = require('./src/js/util/handlers/quiz');
const { categories } = require('./src/js/util/handlers/categories');
const { category } = require('./src/js/util/handlers/category');

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
	origin: '*',
	optionSuccessStatus: 200,
};
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

// app.use('/public/css', express.static(path.join(__dirname, '/public/css')));
// app.use('/static', express.static(path.join(__dirname, '/dist/static/client')));

app.use(cors(corsOptions))

app.route('/api/quizzes/:category/:id').get(quiz);
app.route('/api/quizzes/categories').get(categories);
app.route('/api/quizzes/:category').get(category);

// app.get('/*', (req, res) => {
//     res.sendFile(path.resolve(path.join(__dirname, '/public/index.html')));
// });

app.listen(PORT, () => { console.log(`Server is running on localhost:${PORT}`) });