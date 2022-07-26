import { 
    createElement,
    rubberText
} from "../function.js";
import {
    navigateTo
} from "../router.js"
import AbstractClass from "./AbstractClass.js";

export default class extends AbstractClass {
    constructor(params) {
        super(params);
        let _dom = createElement({
            'type': 'div',
            'classNames': 'home-page'
        });

        this.getDom = () => _dom;
        this.setDom = (dom) => { _dom = dom };

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

        navigateToQuizPageBtn.href = '/quiz/highlight';
        navigateToQuizPageBtn.textContent = 'Get started';
        navigateToQuizPageBtn.addEventListener('click', (event) => {
            const { currentTarget } = event;
            event.preventDefault();
            navigateTo(currentTarget.href)
        });
        contentContainer.insertAdjacentHTML('beforeend', `
            <h1 class="fw-black tc-white"></h1>
            <p class="tc-white ft-sz-14">This quiz app is one of my web app project. It's built with JavaScript, SASS, ExpressJS and FireStore.</p>
            <a href="https://github.com/NguyenAnhTuan1912" target="_blank"><i class="fa fa-github tc-white ft-sz-14 mg-rt-7"></i><span class="tc-white ft-sz-14">NguyenAnhTuan1912</span><span class="tc-white fw-black ft-sz-14">/my-profile</span></a>
            <p class="tc-darker-white ft-sz-14">*Quiz app's source <a href="https://github.com/NguyenAnhTuan1912/quiz-app" class="tc-white fw-black ft-sz-14" style="display: inline" target="_blank">in here</a></p>
        `);
        buttonContainer.append(navigateToQuizPageBtn);
        this.getDom().append(
            contentContainer,
            buttonContainer
        );
        const title = contentContainer.querySelector('h1');
        title.append(...rubberText('Let\'s take a Quiz.'));
    }

    render(isNode = true) {
        this.setTitle('Welcome!');
        document.querySelector('header h1.title').textContent = 'Home';
        return (isNode) ? this.getDom() : this.getDom().outerHTML;
    }
}