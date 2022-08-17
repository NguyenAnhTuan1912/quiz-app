import { 
    createElement,
} from "./function.js";
import {
    router,
    navigateTo
} from "./router.js"
import ModalBox from "./components/ModalBox.js";

const app = {
    render: function() {
        const root = document.getElementById('root'),
        modal = createElement({
            'type': 'div',
            'classNames': 'hide',
            'id': 'modal'
        }),
        confirmBox = new ModalBox('', 'confirm'),
        noteBox = new ModalBox('', 'note'),
        warningBox = new ModalBox('', 'warning');
        modal.append(confirmBox.render(), noteBox.render(), warningBox.render());
        root.append(Header({ 'title': `Home` }));
        root.insertAdjacentHTML('beforeend', '<div id="content"></div>');
        root.append(modal);
        root.insertAdjacentHTML('beforeend', `
            <div class="hide-loading" id="loading" style="display: none;">
                <p>Loading</p>
                    <div class="bar-container">
                    <div class="slide"><div class="bar"></div></div>
                </div>
            </div>
        `);
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
        <h1 class="title tc-white ft-sz-15">${props.title}</h1>
        <div class="menu">
            <nav>
                <a class="tc-white ft-sz-14" href="/" onclick="linkClickHandler(event)" data-link>Home</a>
                <a class="tc-white ft-sz-14" href="/quiz/highlight" onclick="linkClickHandler(event)" data-link>Quiz</a>
            </nav>
        </div>
    `;

    header.insertAdjacentHTML('beforeend', htmls);
    return (isReturnDom) ? header : header.outerHTML;
}

const linkClickHandler = (function() {
    return function navigaToAnotherPage(event) {
        const { currentTarget } = event;
        event.preventDefault();
        navigateTo(currentTarget.href);
    }
})();

document.addEventListener('DOMContentLoaded', (event) => {
    app.start();
    router();
});

window.onpopstate = router;
window.linkClickHandler = linkClickHandler;