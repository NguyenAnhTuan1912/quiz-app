const firebase = require('firebase');
const firebaseConfig = {
    apiKey: "AIzaSyC5MF5OymK6NNrz5zMZ5rhx4hyR3FpjB4I",
    authDomain: "quiz-app-56394.firebaseapp.com",
    projectId: "quiz-app-56394",
    storageBucket: "quiz-app-56394.appspot.com",
    messagingSenderId: "278601869400",
    appId: "1:278601869400:web:6c13ad710152c80026022d",
    measurementId: "G-QT11YFNZ2Y"
};

firebase.initializeApp(firebaseConfig);
module.exports = { firebase };