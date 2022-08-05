import { 
    createElement,
    getParentElement,
    turnOffModal
} from "../Function.js";
import {
    navigateTo
} from "../Router.js"
import AbstractClass from "./AbstractClass.js";

export default class extends AbstractClass {
    #dom;
    #type;
    #data;
    #buttons;
    #condition;
    #objectContructor;

    constructor(params, data, type) {
        super(params, data);
        this.#type = type;
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'modal-box'
        });
        this.#objectContructor = {};
        this.#data = data || '';
        this.#buttons = [];
        this.initDom();
    }

    set setData(data) {
        this.#data = data;
    }

    check() {
    }

    initDom() {
            const htmls = `
            <header>
                <span class="title tc-quiz-blue ft-sz-18 fw-semi-bold">Quiz</span>
            </header>
            <div class="modal-quiz__info mg-bt-6">
                <p class="ft-sz-18 fw-semi-bold mg-bt-3" id="js-quizName">This is the quiz name</p>
                <div class="quiz-info mg-bt-3">
                    <span class="material-symbols-outlined tc-gray ft-sz-14">schedule</span>
                    <span class="tc-gray ft-sz-14 mg-lt-7" id="js-modalInfoTime">3min15s</span>
                    <span class="dot dot-gray dot-5px mg-lt-rt-7"></span>
                    <span class="tc-gray ft-sz-14" id="js-modalInfoAmount">5 Questions.</span>
                </div>
                <p class="info-description ft-sz-14">
                    Challenge yourself to do the “this is the quiz name” and get through 50% people who are taked this quiz. Try you best.
                </p>
            </div>
            `;
            const buttonBox = createElement({
                'type': 'div',
                'classNames': 'button-box'
            });
            this.#buttons.push(
                createElement({
                    'type': 'button',
                    'classNames': 'btn btn-transparent ft-sz-13 tc-quiz-darker-blue',
                    'id': 'js-cancelBtn'
                }),
                createElement({
                    'type': 'a',
                    'classNames': 'btn btn-primary-blue btn-rounded-5px ft-sz-13',
                    'id': 'js-acceptBtn'
                })
            );

            this.#buttons[0].textContent = 'Maybe nex time';
            this.#buttons[1].textContent = 'Get start!';

            this.#buttons[1].href = '/';
            this.#buttons[0].addEventListener('click', hide);
            this.#buttons[1].addEventListener('click', event => {
                linkClickHandler(event);
                const modal = getParentElement(this.#dom);
                turnOffModal(modal);
            });

            buttonBox.append(...this.#buttons);
            this.#dom.insertAdjacentHTML('beforeend', htmls);
            this.#dom.append(buttonBox);
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

const hide = (function() {
    return function hideModal(event) {
        const modal = document.getElementById('modal');
        turnOffModal(modal);
    }
})();