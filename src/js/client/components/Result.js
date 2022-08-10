import { 
    createElement,
    getRandomNumber
} from "../../function.js";
import {
    navigateTo
} from "../../router.js"
import AbstractClass from "./AbstractClass.js";

export default class extends AbstractClass {
    constructor(params, data) {
        super(params);
        this.setTitle('Result');
        document.querySelector('header .title').textContent = 'Quiz result';
        let _dom = createElement({
            'type': 'div',
            'classNames': 'result-page'
        });
        let _data = data;

        this.getDom = () => _dom;
        this.setDom = dom => { _dom = dom };
        this.getData = () => _data;
        this.setData = data => { _data = data };

        this.initDom();
    }

    initDom() {
        const { amount, name, questions } = this.getData()[`quiz-${this.getParams()}`];
        const
        point = new Point('', { amount: amount, name: name, questions: questions}),
        redirect = new Redirect(this.getParams());
        this.getDom().append(
            point.render(),
            redirect.render()
        );
    }

    async render(isNode = true) {
        return (isNode) ? this.getDom() : this.getDom().outerHTML;
    }
}

class Point extends AbstractClass {
    constructor(params, data) {
        super(params);
        let _dom = createElement({
            'type': 'div',
            'classNames': 'point'
        });
        let _data = data;

        this.getDom = () => _dom;
        this.setDom = dom => { _dom = dom };
        this.getData = () => _data;
        this.setData = data => { _data = data };

        this.initDom();
    }

    calcPoint() {
        const { questions } = this.getData();
        let point = 0;
        questions.forEach(question => {
            question.choices.forEach(choice => {
                if(choice.checked === choice.isAnswer && choice.checked) point += 1;
            });
        });
        return point;
    }

    initDom() {
        const { amount, name } = this.getData();
        this.getDom().insertAdjacentHTML('beforeend', `
            <div class="point-box">
                <h2 class="point-box__title tc-white">CONGRATULATION!</h2>
                <h1 class="fw-light ft-sz-20 tc-white" js="js-point">${this.calcPoint()}</h1>
                <hr>
                <h1 class="fw-black ft-sz-20 tc-white">${amount}</h1>
                <p class="point-box__message tc-white">You are in: <span class="fw-black" id="js-resultQuizName">${name}</span></p>
            </div>
        `);
    }

    render(isNode = true) {
        return (isNode) ? this.getDom() : this.getDom().outerHTML;
    }

}

class Redirect extends AbstractClass {
    constructor(params, data) {
        super(params);
        let _dom = createElement({
            'type': 'div',
            'classNames': 'redirect'
        });
        let _data = data;

        this.getDom = () => _dom;
        this.setDom = dom => { _dom = dom };
        this.getData = () => _data;
        this.setData = data => { _data = data };

        this.initDom();
    }

    initDom() {
        const
        reviewQuizBtn = createElement({
            'type': 'a',
            'classNames': 'btn btn-primary btn-rounded-5px ft-sz-13'
        }),
        goHomeBtn = createElement({
            'type': 'a',
            'classNames': 'btn btn-transparent tc-white ft-sz-13'
        });

        reviewQuizBtn.insertAdjacentHTML('beforeend', '<span>View answer</span>');
        goHomeBtn.insertAdjacentHTML('beforeend', '<span class="material-symbols-outlined ft-sz-15">arrow_back</span>Back to home');

        reviewQuizBtn.href = '/quiz-answer/quiz-' + this.getParams();
        goHomeBtn.href = '/';

        reviewQuizBtn.addEventListener('click', (event) => {
            const { currentTarget } = event;
            event.preventDefault();
            navigateTo(currentTarget.href)
        });
        goHomeBtn.addEventListener('click', (event) => {
            const { currentTarget } = event;
            event.preventDefault();
            navigateTo(currentTarget.href)
        });

        this.getDom().append(
            reviewQuizBtn,
            goHomeBtn
        );
    }

    render(isNode = true) {
        return (isNode) ? this.getDom() : this.getDom().outerHTML;
    }
}

// function Redirect(props = {}, isReturnDom = true) {
//     const div = createElement({
//         'type': 'div',
//         'classNames': 'redirect'
//     });

//     const htmls = `
//         <div class="btn btn-primary-blue btn-rounded-5px"><span>Xem lại bài kiểm tra</span></div>
//         <div class="btn btn-next btn-rounded-5px"><span class="text-bold">Bài tiếp theo: </span><span id="js-quizName">Quiz name</span></div>
//     `;

//     div.insertAdjacentHTML('beforeend', htmls);
//     return (isReturnDom) ? div : div.outerHTML;
// }

// function Point(props = {}, isReturnDom = true) {
//     const div = createElement({
//         'type': 'div',
//         'classNames': 'point'
//     });

//     const htmls = `
//         <div class="point-box">
//             <h2 class="point-box__title">ĐIỂM CỦA BẠN:</h2>
//             <h1 class="text-semi-light ft-sz-20" js="js-point">15</h1>
//             <hr>
//             <h1 class="text-bold ft-sz-20">15</h1>
//             <p class="point-box__message" js="js-pointBoxMessage">Bạn đã đạt được điểm tuyệt đối!</p>
//         </div>
//     `;


//     div.insertAdjacentHTML('beforeend', htmls);
//     return (isReturnDom) ? div : div.outerHTML;
// }