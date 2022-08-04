import Home from './components/Home.js';
import Quiz from "./components/Quiz.js";
import Result from "./components/Result.js";
import Answer from './components/Answer.js';
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
                amount: data[key].amount
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

async function router() {
    const routes = [
        {
            path: '/',
            view: Home
        },
        {
            path: '/quiz',
            view: Quiz
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
        data = getHomeQuizBoxData(Quizzes);
        const keys = Object.keys(Quizzes);
        keys.forEach(key => {
            Quizzes[key].isPending = false;
        });
    };
    if(match.route.view === Quiz) {
        data = getSpecificQuizData(id, Quizzes);
        Quizzes[`quiz-${id}`].isPending = false;
    };
    if(match.route.view === Result) {
        Quizzes[id].isPending = false;
        id = id[id.length - 1];
        data = getAllQuizzesData(Quizzes);
    }
    if(match.route.view === Answer) {
        id = id[id.length - 1];
        data = data = getSpecificQuizData(id, Quizzes);
    }

    const view = new match.route.view(id, data);

    
    // console.log(quizzes);
    // console.log(view.getData);
    
    const content = document.getElementById('content');
    content.innerHTML = '';
    // content.insertAdjacentHTML('beforeend', `${await view.render()}`);
    content.appendChild(await view.render());
}

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

window.quizzes = quizzes;

export {
    router,
    navigateTo
}