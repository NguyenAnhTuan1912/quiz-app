import { createElement } from "./Function.js";
import Home from "./Home.js";
import Quiz from "./Quiz.js";
import Result from "./Result.js";

const app = {
    render: function() {
        const root = document.getElementById('root');


        root.append(Header({ 'title': 'Quiz' }));
        
        Home.render();
        // Quiz.render();
        // Result.render();
    },
    start: function() {
        this.render();
    }
}

window.onload = function() {
    app.start();
}

function Header(props = {}, isReturnDom = true) {
    const header = createElement({
        'type': 'header',
        'classNames': 'header'
    });

    const htmls = `
        <div class="header-back"><span class="material-symbols-outlined ft-sz-14" js="js-back">arrow_back_ios</span><span class="text-bold ft-sz-14">Home</span></div>
        <h1 class="title">${props.title}</h1>
        <div class="btn hide">Submit</div>
    `;

    header.insertAdjacentHTML('beforeend', htmls);
    return (isReturnDom) ? header : header.outerHTML;
}