const { db } = require("../admin");

exports.categories = async (req, res) => {
    try {
        db.collection('quizzes').get().then(snapshot => {
            const categories = snapshot.docs.map(doc => {
                return {
                    'id': doc.id,
                    'amountQuiz': 0,
                    'icon': doc.data().icon
                }
            });
            return res.status(201).json(categories);
        });
    } catch (error) {
        return res
        .status(500)
        .json({ general: "Something went wrong, please try again"});
    }
}