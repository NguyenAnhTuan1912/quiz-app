import { createElement } from "../Function.js";
import AbstractClass from "./AbstractClass.js";

export default class extends AbstractClass {
    #dom;

    constructor(params, data) {
        super(params, data);
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'result-page'
        });
        this.initDom();
    }

    initDom() {
        const
        point = new Point(),
        redirect = new Redirect();
        this.#dom.append(
            point.render(),
            redirect.render()
        );
    }

    async render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

class Point extends AbstractClass {
    #dom;

    constructor(params, data) {
        super(params, data);
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'point'
        });
        this.initDom();
    }

    initDom() {
        this.#dom.insertAdjacentHTML('beforeend', `
            <div class="point-box">
                <h2 class="point-box__title">YOUR SCORE:</h2>
                <h1 class="text-semi-light ft-sz-20" js="js-point">15</h1>
                <hr>
                <h1 class="text-bold ft-sz-20">15</h1>
                <p class="point-box__message">You are in: <span class="text-bold" id="js-resultQuizName">[Quiz name]</span></p>
            </div>
        `);
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }

}

class Redirect extends AbstractClass {
    #dom;

    constructor(params, data) {
        super(params, data);
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'redirect'
        });
        this.initDom();
    }

    initDom() {
        const
        reviewQuizBtn = createElement({
            'type': 'a',
            'classNames': 'btn btn-primary-blue btn-rounded-5px'
        }),
        nextQuizBtn = createElement({
            'type': 'a',
            'classNames': 'btn btn-next btn-rounded-5px'
        });

        reviewQuizBtn.insertAdjacentHTML('beforeend', '<span>Review</span>');
        nextQuizBtn.insertAdjacentHTML('beforeend', '<span class="text-bold">Bài tiếp theo: </span><span id="js-quizName">Quiz name</span>');

        this.#dom.append(
            reviewQuizBtn,
            nextQuizBtn
        );
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
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