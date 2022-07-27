import { createElement, show } from "../components/Function.js";
import Home from '../components/Home.js';
import Quiz from "../components/Quiz.js";
import Result from "../components/Result.js";

const app = {
    render: async function() {
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

async function router() {
    const routes = [
        {
            path: '/',
            view: Home
        },
        {
            path: '/quiz',
            view: Quiz
        }
    ], notFoundRoute = {
        path: '/notfound',
        view: () => console.log('Error 404: Page not found!')
    };

    const maybeMatches = routes.map((route) => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        }
    });

    let match = maybeMatches.find(maybeMatch => maybeMatch.isMatch);

    if(!match) {
        match = {
            route: notFoundRoute,
            isMatch: false
        }
    }

    const view = new match.route.view();

    document.getElementById('content').innerHTML = `${await view.render()}`;
}

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

window.onpopstate = router;

document.addEventListener('DOMContentLoaded', (event) => {
    app.start().then(() => {
        router();
        const links = document.querySelectorAll('[data-link]');
        links.forEach((link) => {
            link.addEventListener('click', (event => {
                event.preventDefault();
                const { currentTarget } = event;
                navigateTo(currentTarget.href);
            }));
        });
    });
});

function render(element, container) {
    while(container.firstChild !== container.lastChild) {
        container.removeChild(container.lastChild);
    }
}