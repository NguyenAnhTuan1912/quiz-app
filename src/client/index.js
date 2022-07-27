import { createElement, show } from "../components/Function.js";
import Home from '../components/Home.js';
import Quiz from "../components/Quiz.js";
import Result from "../components/Result.js";

const app = {
    render: function() {
        const root = document.getElementById('root');
        root.append(Header({ 'title': 'Quiz' }));
        root.insertAdjacentHTML('beforeend', '<div id="content"></div>')
    },
    start: function() {
        return this.render();
    }
}

function Header(props = {}, isReturnDom = true) {
    const header = createElement({
        'type': 'header',
        'classNames': 'header'
    });

    const htmls = `
        <div class="header-back hide"><span class="material-symbols-outlined ft-sz-14" js="js-back">arrow_back_ios</span><span class="text-bold ft-sz-14">Home</span></div>
        <h1 class="title">${props.title}</h1>
        <div class="menu move-x">
            <span class="material-symbols-outlined" id="js-menu">menu</span>
            <nav>
                <a href="/" data-link>Home</a>
                <a href="/quiz" data-link>Quiz</a>
            </nav>
        </div>
        <div class="btn hide">Submit</div>
    `;

    header.insertAdjacentHTML('beforeend', htmls);
    const menu = header.querySelector('#js-menu');
    menu.addEventListener('click', show);
    return (isReturnDom) ? header : header.outerHTML;
}

const pathToRegEx = (path = '') => new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');

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

    const view = new match.route.view();

    document.getElementById('content').innerHTML = `${await view.render()}`;
}

window.onpopstate = router;

const linkClickHandler = (function() {
    return function navigaToAnotherPage(event) {
        const { currentTarget } = event;
        event.preventDefault();
        navigateTo(currentTarget.href);
    }
})();

document.addEventListener('DOMContentLoaded', (event) => {
    app.start()
    router().then(() => {
        const links = document.querySelectorAll('[data-link]');
        console.log(links);
        addHandlerToElements(links, 'click', linkClickHandler);
        // links.forEach((link) => {
        //     link.addEventListener('click', (event => {
        //         const { currentTarget } = event;
        //         event.preventDefault();
        //         navigateTo(currentTarget.href);
        //     }));
        // });
    });
});

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

function addHandlerToElements(elements = [], eventType = '', handler = () => {}) {
    try {
        if(!(elements instanceof NodeList)) throw 'TypeError: This elements is not a NodeList.'
        elements.forEach((elements) => {
            elements.addEventListener(eventType, handler);
        });
    } catch (error) {
        console.error(error);
    }
}

function render(element, container) {
    while(container.firstChild !== container.lastChild) {
        container.removeChild(container.lastChild);
    }
}