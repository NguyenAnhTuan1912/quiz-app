import { 
    createElement,
    getParentElement,
    hideModal,
    turnOffModal
} from "../function.js";
import AbstractClass from "./AbstractClass.js";

export default class extends AbstractClass {
    constructor(params, data) {
        super(params);
        let _buttons = [];
        let _data = data;
        let _dom = createElement({
            'type': 'div',
            'classNames': 'modal-box hide',
            'id': data
        });

        this.getDom = () => _dom;
        this.setDom = () => _dom;
        this.getData = () => _data;
        this.setDom = () => _dom;
        this.getButtons = () => _buttons;
        this.setButtons = buttons => _buttons.concat(buttons);
        this.initDom();
    }

    check() {
    }

    initDom() {
        let htmls = '';
        const buttonBox = createElement({
            'type': 'div',
            'classNames': 'button-box'
        });
        if((/confirm/gi).test(this.getData())) {
            htmls = `
                <header>
                    <span class="title tc-quiz-blue ft-sz-18 fw-semi-bold">Confirm</span>
                </header>
                <div class="modal-quiz__info mg-bt-6">
                    <p class="ft-sz-18 fw-semi-bold mg-bt-3" id="js-quizName"></p>
                    <div class="quiz-info mg-bt-3">
                        <span class="material-symbols-outlined tc-gray ft-sz-14">schedule</span>
                        <span class="tc-gray ft-sz-14 mg-lt-7" id="js-modalInfoTime"></span>
                        <span class="dot dot-gray dot-5px mg-lt-rt-7"></span>
                        <span class="tc-gray ft-sz-14" id="js-modalInfoAmount"></span>
                    </div>
                    <p class="info-description ft-sz-14">
                        Challenge yourself to do the “this is the quiz name” and get through 50% people who are taked this quiz. Try you best.
                    </p>
                </div>
            `;
            this.getButtons().push(
                createElement({
                    'type': 'button',
                    'classNames': 'btn btn-transparent ft-sz-13 tc-quiz-darker-blue'
                }),
                createElement({
                    'type': 'a',
                    'classNames': 'btn btn-primary-blue btn-rounded-5px ft-sz-13',
                    'id': 'js-acceptBtn'
                })
            );

            this.getButtons()[0].textContent = 'Maybe nex time';
            this.getButtons()[1].textContent = 'Get start!';

            this.getButtons()[1].href = '/';
            this.getButtons()[0].addEventListener('click', hideModal);
            this.getButtons()[1].addEventListener('click', event => {
                linkClickHandler(event);
                const modal = getParentElement(this.getDom()),
                messageBox = modal.querySelector('#confirm');
                turnOffModal(modal, messageBox);
            });

            buttonBox.append(...this.getButtons());
        }
        if((/note/gi).test(this.getData())) {
            htmls = `
                <header>
                    <span class="title tc-quiz-darker-yellow ft-sz-18 fw-semi-bold">Note</span>
                </header>
                <div class="modal-quiz__info mg-bt-6">
                    <p class="ft-sz-18 fw-semi-bold mg-bt-3" id="js-noteTitle">Are you sure?</p>
                    <p class="info-description ft-sz-14" id="js-noteMessage">
                        Let check you answers and make sure it's your best answers. After rechecking, press(or click) the “Hand in” button below to hand in your answers.
                    </p>
                </div>
            `;
            this.getButtons().push(
                createElement({
                    'type': 'button',
                    'classNames': 'btn btn-transparent ft-sz-13 tc-quiz-darker-yellow'
                }),
                createElement({
                    'type': 'a',
                    'classNames': 'btn btn-primary-yellow btn-rounded-5px ft-sz-13',
                    'id': 'js-noteBoxHandInBtn'
                })
            );

            this.getButtons()[0].textContent = 'Let me check again';
            this.getButtons()[1].textContent = 'Hand in!';

            this.getButtons()[1].href = '/';
            this.getButtons()[0].addEventListener('click', hideModal);
            this.getButtons()[1].addEventListener('click', event => {
                linkClickHandler(event);
                const modal = getParentElement(this.getDom()),
                messageBox = modal.querySelector('#note');
                turnOffModal(modal, messageBox);
            });

            buttonBox.append(...this.getButtons());
        }
        if((/warning/gi).test(this.getData())) {
            htmls = `
                <header>
                    <span class="title tc-quiz-darker-red ft-sz-18 fw-semi-bold">Warning</span>
                </header>
                <div class="modal-quiz__info mg-bt-6">
                    <p class="ft-sz-18 fw-semi-bold mg-bt-3" id="js-warningTitle">Time out!</p>
                    <p class="info-description ft-sz-14" id="js-warningMessage">
                        Sorry :(, the timer said that it's counter was completely it's work and you weren't hand in your answers. Please top and hand in now.
                    </p>
                </div>
            `;
            this.getButtons().push(
                createElement({
                    'type': 'a',
                    'classNames': 'btn btn-primary-red btn-rounded-5px ft-sz-13',
                    'id': 'js-warningBoxHandInBtn'
                })
            );

            this.getButtons()[0].textContent = 'Hand in!';

            this.getButtons()[0].href = '/';
            this.getButtons()[0].addEventListener('click', event => {
                linkClickHandler(event);
                const modal = getParentElement(this.getDom()),
                warningBox = modal.querySelector('#warning');
                turnOffModal(modal, warningBox);
            });

            buttonBox.append(...this.getButtons());
        }

        this.getDom().insertAdjacentHTML('beforeend', htmls);
        this.getDom().append(buttonBox);
    }

    render(isNode = true) {
        return (isNode) ? this.getDom() : this.getDom().outerHTML;
    }
}