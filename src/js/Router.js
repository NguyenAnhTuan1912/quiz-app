import Home from './client/components/Home';
import Quiz from "./client/components/Quiz.js";
import Result from "./client/components/Result.js";
import Answer from './client/components/Answer.js';
import QuizSection from './client/components/QuizSection.js';
import quizzes from "../fakedata/quizzes.json" assert {type: 'json'};

const Quizzes = { ...quizzes };

const pathToRegEx = (path = '') => new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');

const getHomeQuizBoxData = (data) => {
    try {
        if(typeof data !== 'object' || Array.isArray(data)) throw 'TypeError: Data must be an Object!';
        const keys = Object.keys(data);
        return keys.map((key) => {
            return {
                id: key[key.length - 1],
                name: data[key].name,
                amount: data[key].amount,
                time: data[key].time
            };
        });
    } catch (error) {
        console.error(error);
    }
};

const getSpecificQuizData = (id = '', data = {}) => {
    try {
        if(typeof data !== 'object' || Array.isArray(data)) throw 'TypeError: Data must be an Object!';
        if(typeof id !== 'string') throw 'TypeError: Id must be a String!';
        return data[`quiz-${id}`];
    } catch (error) {
        console.error(error);
    }
}

const getAllQuizzesData = (data = {}) => {
    try {
        if(typeof data !== 'object' || Array.isArray(data)) throw 'TypeError: Data must be an Object!';
        return data;
    } catch (error) {
        console.error(error);
    }
}

function getParams(match = {}) {
    try {
        if(!Array.isArray(match.result)) throw 'TypeError: Your match.result must be an Array!';
        const values = match.result.slice(1);
        const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(char => char[1]);

        return Object.fromEntries(keys.map((key, index) => {
            return [key, values[index]];
        }));
    } catch (error) {
        console.error(error);
    }
}

const dot = document.getElementsByClassName('backdrop__dot'),
dotLength = dot.length;

function canSeeDot(...indexes) {
    let j = 0;
    for(let i = 0; i < dotLength; i++) {
        if(indexes[j] === i) {
            dot[i].classList.remove('hide');
            j += 1;
        } else dot[i].classList.add('hide');
    }
}

// indexes.forEach(index => {
//     dot[index].classList.remove('hide');
// });

async function router() {
    const content = document.getElementById('content');
    const routes = [
        {
            path: '/',
            view: Home
        },
        {
            path: '/quiz',
            view: QuizSection
        },
        {
            path: '/quiz/:id',
            view: Quiz
        },
        {
            path: '/result/:id',
            view: Result
        },
        {
            path: '/quiz-answer/:id',
            view: Answer
        }
    ], notFoundRoute = {
        path: '/notfound',
        view: () => `<h1>Error 404: Page not found! :(</h1>`
    };

    const maybeMatches = routes.map((route) => {
        return {
            route: route,
            result: location.pathname.match(pathToRegEx(route.path))
        }
    });

    let match = maybeMatches.find(maybeMatch => maybeMatch.result !== null);

    if(!match) {
        match = {
            route: notFoundRoute,
            result: location.pathname.match(pathToRegEx(notFoundRoute.path))
        }
    }

    let data, { id } = getParams(match) || '';
    if(match.route.view === Home) {
        canSeeDot(0);
    }
    if(match.route.view === QuizSection) {
        canSeeDot(1, 2);
        data = getHomeQuizBoxData(Quizzes);
        const keys = Object.keys(Quizzes);
        keys.forEach(key => {
            Quizzes[key].isPending = false;
        });
    };
    if(match.route.view === Quiz) {
        canSeeDot(1, 2);
        data = getSpecificQuizData(id, Quizzes);
        // Quizzes[`quiz-${id}`].isPending = false;
    };
    if(match.route.view === Result) {
        canSeeDot(3, 4);
        id = id[id.length - 1];
        data = getAllQuizzesData(Quizzes);
        Quizzes['quiz-' + id].isPending = false;
    }
    if(match.route.view === Answer) {
        canSeeDot(5);
        id = id[id.length - 1];
        data = getSpecificQuizData(id, Quizzes);
    }

    content.innerHTML = '';
    let view = new match.route.view(id, data);

    
    // console.log(quizzes);
    // console.log(view.getData);
    // content.insertAdjacentHTML('beforeend', `${await view.render()}`);
    content.appendChild(await view.render());
    view = null;
}

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

export {
    router,
    navigateTo
}