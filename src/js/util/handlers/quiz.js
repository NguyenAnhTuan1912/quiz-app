const { db } = require("../admin");

exports.quiz = async (req, res) => {
    const quizCategoryCollectionRef = db.collection('quizzes').doc(req.params.category).collection('data');
    console.log(req.params.category);
    console.log(req.params.id);
    // .doc(`$${req.params.category}-quiz-${req.params.id}`)
    try {
        quizCategoryCollectionRef.get().then(snapshot => {
            const potential = snapshot.docs.find(doc => doc.id === `${req.params.category}-quiz-${req.params.id}`);
            const data = {
                'id': potential.id,
                ...potential.data()
            }
        console.log(data);
        return res.status(201).json(data);
        });
    } catch (error) {
        return res
        .status(500)
        .json({ general: "Something went wrong, please try again"});
    }
}