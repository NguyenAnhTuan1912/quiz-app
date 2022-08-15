const { db } = require("../admin");

exports.category = async (req, res) => {
    try {
        if(req.params.category === 'all') {
            const categories = ['math', 'fun', 'logic'];
            const quizzesCollection = db.collection('quizzes');
            const data = [], promises = [];
            categories.forEach(category => {
                const dataCollection = quizzesCollection.doc(category).collection('data');
                promises.push(dataCollection.get());
            });
            Promise.all(promises)
                .then(values => {
                    values.forEach((snapshot, index) => {
                        const d = snapshot.docs.map(doc => {
                            return {
                                'id': doc.id,
                                'name': doc.data().name,
                                'amount': doc.data().amount,
                                'time': doc.data().time,
                                'isTest': doc.data().isTest,
                                'isHighlight': doc.data().isHighlight
                            }
                        });
                        console.log(d);
                        // data[categories[index]] = d;
                        data.push(...d);
                    });
                    return res.status(201).json(data);
                });
        } else {
            const refCategoryDataCollection = db.collection('quizzes').doc(req.params.category).collection('data');
            refCategoryDataCollection.get().then(snapshot => {
                const allCategoryQuiz = snapshot.docs.map(doc => {
                    return {
                        'id': doc.id,
                        'name': doc.data().name,
                        'amount': doc.data().amount,
                        'time': doc.data().time,
                        'isTest': doc.data().isTest,
                        'isHighlight': doc.data().isHighlight
                    }
                });
                console.log(allCategoryQuiz);
                return res.status(201).json(allCategoryQuiz);
            });
        }
    } catch (error) {
        return res
        .status(500)
        .json({ general: "Something went wrong, please try again"});
    }
}