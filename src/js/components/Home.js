import { 
    createElement
} from "../Function.js";
import {
    navigateTo
} from "../Router.js"
import AbstractClass from "./AbstractClass.js";

export default class extends AbstractClass {
    #dom;

    constructor(params, data) {
        super(params, data);
        this.setTitle('Welcome!');
        document.querySelector('header .title').textContent = 'Home';
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'home-page'
        });
        this.initDom();
    }

    initDom() {
        const contentContainer = createElement({
            'type': 'div',
            'classNames': 'home-content'
        }),
        buttonContainer = createElement({
            'type': 'div',
            'classNames': 'home-button'
        }),
        navigateToQuizPageBtn = createElement({
            'type': 'a',
            'classNames': 'btn btn-primary btn-rounded-5px'
        });

        navigateToQuizPageBtn.href = '/quiz';
        navigateToQuizPageBtn.textContent = 'Get started';
        navigateToQuizPageBtn.addEventListener('click', (event) => {
            const { currentTarget } = event;
            event.preventDefault();
            navigateTo(currentTarget.href)
        });
        contentContainer.insertAdjacentHTML('beforeend', `
            <h1 class="fw-black tc-white">Let's take a Quiz.</h1>
            <p class="tc-white ft-sz-14">This quiz app is one of my web app project. It's built with JavaScript, SASS, ExpressJS and FireStore.</p>
            <a href="https://github.com/NguyenAnhTuan1912" target="_blank"><i class="fa fa-github tc-white ft-sz-14 mg-rt-7"></i><span class="tc-white ft-sz-14">NguyenAnhTuan1912</span><span class="tc-white fw-bold ft-sz-14">/my-profile</span></a>
            <p class="tc-darker-white ft-sz-14">*Quiz app's source <a href="https://github.com/NguyenAnhTuan1912/quiz-app" class="tc-darker-white ft-sz-14" style="display: inline" target="_blank">in here</a></p>
        `);
        buttonContainer.append(navigateToQuizPageBtn);
        this.#dom.append(
            contentContainer,
            buttonContainer
        );
    }

    async render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}