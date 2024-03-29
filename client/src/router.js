import Home from './components/Home.js';
import Quiz from "./components/Quiz.js";
import Result from "./components/Result.js";
import Answer from './components/Answer.js';
import QuizSection from './components/QuizSection.js';
import { 
    focusOnCategoryButton
} from './function.js'

const pathToRegEx = (path = '') => new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');

async function fetchData(path) {
    const response = await fetch(path);
    return response.json();
}

async function getCategories(path) {
    const data = await fetchData(path);
    return data;
}

async function getFirstCategoryData(path) {
    const data = await fetchData(path);
    return data;
}

async function getCategoryData(path) {
    const data = await fetchData(path);
    return data;
}

async function getQuizData(path) {
    const data = await fetchData(path);
    return data;
}

function getParams(match = {}) {
    try {
        if(!Array.isArray(match.result)) throw 'TypeError: Your match.result must be an Array!';
        const values = match.result.slice(1);
        const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(char => char[1]);

        return Object.fromEntries(keys.map((key, index) => {
            return [key, values[index]];
        }));
    } catch(error) {
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

function DataStore() {
    let _quizCategoriesData = {}, _quizData = null, _allCategories = [];

    this.resetQuizCategoriesData = () => {
        _quizCategoriesData = {};
    }

    this.setAll = (data, categories) => {
        _allCategories = data;
        this.setQuizCategoriesData(categories);
    }

    this.getAll = () => {
        return _allCategories;
    }

    this.setQuizCategoriesData = (categories) => {
        _quizCategoriesData['highlight'] = this.getAll().filter(quiz => {
            if(quiz.isHighlight) return quiz;
        });
        categories.forEach(category => {
            _quizCategoriesData[category] = this.getAll().filter(quiz => quiz.id.split('-')[0] === category);
        });
    }

    this.thisQuizIsTested = id => {
        _quizCategoriesData[id.split('-')[0]].find(quiz => quiz.id === id).isTest = true;
    };

    this.isQuizCategoriesDataNull = () => {
        const keys = Object.keys(_quizCategoriesData);
        return (keys.length === 0) ? true : false;
    };

    this.getNumberOfQuiz = category => _quizCategoriesData[category].length;

    this.getQuizCategoryData = category => _quizCategoriesData[category];

    this.getSpecificCategoryData = id => _quizCategoriesData[id.split('-')[0]].find(quiz => quiz.id === id);

    this.setQuizData = data => {
        _quizData = data;
    }

    this.getQuizData = () => _quizData;
}

function View() {
    let _view = {
        home: null,
        quizPage: null,
        other: null
    };

    this.setView = view => { 
        if(_view.home === null && view instanceof Home) {
            _view.home = view;
        } else if(_view.quizPage === null && view instanceof QuizSection) {
            _view.quizPage = view;
        } else _view.other = view;
    };
    
    this.setOtherViewNull = () => {
        _view.other = null;
    }

    this.getview = name => _view[name];
}

const store = new DataStore();
const view = new View();

// indexes.forEach(index => {
//     dot[index].classList.remove('hide');
// });

async function router() {
    let content = document.getElementById('content'),
    loading = document.getElementById('loading');
    const routes = [
        {
            path: '/',
            view: Home
        },
        {
            path: '/quiz/:category/:id',
            view: Quiz
        },
        {
            path: '/quiz/:category',
            view: QuizSection
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
    let params = getParams(match) || '';
    content.innerHTML = '';
    if(match.route.view === Home) {
        canSeeDot(0);
        if(view.getview('other') instanceof Quiz) view.getview('other').stopTime();
        if(view.getview('home') === null) view.setView(new match.route.view());
        content.appendChild(view.getview('home').render());
    }
    if(match.route.view === QuizSection) {
        canSeeDot(1, 2);
        if(view.getview('other') instanceof Quiz) view.getview('other').stopTime();
        if(store.isQuizCategoriesDataNull()) {
            loading.style.display = 'flex';
            loading.classList.remove('hide-loading');
            const pureCategoriesData = await getCategories(`/api/quizzes/categories`),
            categories = Object.fromEntries(pureCategoriesData.map(category => {
                return [category.id, { 'amountQuiz': category.amountQuiz, 'icon': category.icon }];
            })),
            categoriesName = Object.keys(categories);
            store.setAll(await getFirstCategoryData(`/api/quizzes/all`), categoriesName);
            const completeCategoryInfo = Object.fromEntries(categoriesName.map(category => [category, { 'amountQuiz': store.getQuizCategoryData(category).length, 'icon': categories[category]['icon']}]));
            view.setView(new match.route.view(params['category'], store.getQuizCategoryData(params['category']), store.getAll(), completeCategoryInfo));
            content.appendChild(view.getview('quizPage').render());
            const cateContainer = document.getElementById('js-quizPageQuizCategoryContainer'),
            amountButton = categories.length + 1,
            potentialButton = location.pathname.split('/')[2];
            cateContainer.querySelector(':first-child').childNodes.forEach((child, index) => {
                if(potentialButton === child.href.split('/')[4]) focusOnCategoryButton(cateContainer, amountButton, index);
            });
            loading.classList.add('hide-loading');
        } else {
            content.appendChild(view.getview('quizPage').render());
            view.getview('quizPage').setData(store.getQuizCategoryData(params['category']));
            view.getview('quizPage').changeQuizzes();
            return;
        }
    };
    if(match.route.view === Quiz) {
        canSeeDot(1, 2);
        if(view.getview('other') instanceof Quiz) view.getview('other').stopTime();
        view.setOtherViewNull();
        store.setQuizData(null);
        store.setQuizData(await getQuizData(`/api/quizzes/${params['category']}/${params['id']}`));
        store.getQuizData().isPending = true;
        view.setView(new match.route.view(params.id, store.getQuizData()));
        content.appendChild(view.getview('other').render());
    };
    if(match.route.view === Result) {
        if(!store.getQuizData()) { navigateTo('/'); return; };
        canSeeDot(3, 4);
        if(view.getview('other') instanceof Quiz) {
            const pathname = location.pathname;
            view.getview('other').stopTime();
            store.getQuizData().isPending = false;
            store.thisQuizIsTested(pathname.split('/')[2]);
        }
        view.setOtherViewNull();
        view.setView(new match.route.view(params['id'], store.getQuizData()));
        content.appendChild(view.getview('other').render());
    }
    if(match.route.view === Answer) {
        if(!store.getQuizData()) { navigateTo('/'); return; };
        canSeeDot(5);
        if(view.getview('other') instanceof Quiz) view.getview('other').stopTime();
        view.setOtherViewNull();
        view.setView(new match.route.view(params.id, store.getQuizData()));
        content.appendChild(view.getview('other').render());
    }
    // content.insertAdjacentHTML('beforeend', `${await view.render()}`);
    content = loading = null;
}

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

export {
    router,
    navigateTo
}