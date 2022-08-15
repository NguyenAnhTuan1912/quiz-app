const { db } = require("../admin");

exports.categories = async (req, res) => {
    try {
        db.collection('quizzes').get().then(snapshot => {
            const categories = snapshot.docs.map(doc => doc.id);
            console.log(categories);
            return res.status(201).json(categories);
        });
    } catch (error) {
        return res
        .status(500)
        .json({ general: "Something went wrong, please try again"});
    }
}