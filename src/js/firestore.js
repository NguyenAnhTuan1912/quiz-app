// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, query, getDocs, doc, deleteDoc, updateDoc, Timestamp, orderBy, onSnapshot, Firestore, getDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5MF5OymK6NNrz5zMZ5rhx4hyR3FpjB4I",
  authDomain: "quiz-app-56394.firebaseapp.com",
  projectId: "quiz-app-56394",
  storageBucket: "quiz-app-56394.appspot.com",
  messagingSenderId: "278601869400",
  appId: "1:278601869400:web:6c13ad710152c80026022d",
  measurementId: "G-QT11YFNZ2Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getQuiz = async (category, id) => {
    const quizCollection = collection(db, 'quizzes', category, 'data');
    const quiz = await getDocs(quizCollection);
    const potentialQuiz = quiz.docs.find(doc => doc.id === id);
    return {
        'id': potentialQuiz.id,
        ...potentialQuiz.data()
    };
}

export {
    getQuiz
}